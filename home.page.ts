import { HttpClient } from '@angular/common/http';
import { Component, ViewChildren, QueryList, ElementRef, AfterViewInit }from '@angular/core';
import { Chart, registerables } from 'chart.js';

interface Run {
  id: number;
  name: string;
  time: number;
  distance: number;
}
interface GroupedRuns {
  [distance: number]: { totalTimes: number; count: number };
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit {
  @ViewChildren('scatterChart') scatterCharts!: QueryList<ElementRef>;
  bars: any;

  name: string = '';
  time: number = 0;
  distance: number = 0;

  showForm: boolean = true;
  showGraphAndClear: boolean = false;
  groupedRuns: GroupedRuns = {};

  allowedDistances = [100, 200, 400, 800]; // Specify the allowed distances

  constructor(private http: HttpClient) {
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
    if (this.showGraphAndClear) {
      this.getRuns();
    }
  }

addRun(): void {
  console.log('addRun triggered');
  const runData = { time: this.time, distance: this.distance };
  console.log('Sending run data:', runData);
  this.http.post('http://localhost:3000/addRun', runData).subscribe({
    next: (response) => {
      console.log('Response from server:', response);
     this.showForm = false;
      this.showGraphAndClear = true;
      this.getRuns();
    },
    error: (error) => {
     console.error('Error adding run:', error);
    }
   });
 }
  


  onEnterTouch(event: TouchEvent): void {
   console.log('onEnterTouch triggered');
   event.preventDefault();
   event.stopPropagation();
   this.addRun();
  }
  
  
  
  getRuns() {
    this.http.get<Run[]>('http://localhost:3000/getRuns').subscribe((data) => {
      console.log('Run data:', data);

      // Filter the runs to include only the allowed distances
      const filteredRuns = data.filter(run => this.allowedDistances.includes(run.distance));

      // Group the filtered runs by distance
      const runsByDistance = filteredRuns.reduce((acc: { [key: number]: Run[] }, run) => {
        acc[run.distance] = acc[run.distance] || [];
        acc[run.distance].push(run);
        return acc;
      }, {});

      // Create a scatter plot for each allowed distance
      this.allowedDistances.forEach((distance, index) => {
        const runs = runsByDistance[distance] || [];
        this.createScatterPlot(distance, runs, index);
      });
    });
  }

  getDistances(): number[] {
    return Object.keys(this.groupedRuns).map(Number).sort((a, b) => a - b);
  }

  getAvgTime(distance: number): number {
    return this.groupedRuns[distance] ? this.groupedRuns[distance].totalTimes / this.groupedRuns[distance].count : 0;
  }

  clearForm() {
    this.name = '';
    this.time = 0;
    this.distance = 0;
    this.showForm = true;
    this.showGraphAndClear = false;
    if (this.bars) {
      this.bars.forEach((bar: Chart) => bar.destroy());
      this.bars = null;
    }
  }

  createScatterPlot(distance: number, runs: Run[], chartIndex: number) {
    const scatterData = runs.map((run, index) => ({
      x: index,  // Use the index as the x-value
      y: run.time
    }));
  
    const pb = Math.min(...runs.map(run => run.time)).toFixed(2); // Calculate the personal best as the lowest time and format it to one decimal place
  
    const totalTimes = runs.reduce((acc, run) => acc + run.time, 0);
    const avgTime = totalTimes / runs.length; // Calculate the average time
  
    const canvas = this.scatterCharts.toArray()[chartIndex].nativeElement;
  
    new Chart(canvas, {
      type: 'scatter',
      data: {
        datasets: [{
          label: `Distance: ${distance} meters`,
          data: scatterData,
          backgroundColor: 'rgba(128, 0, 128, 0.2)', // Purple with transparency
          borderColor: 'rgba(128, 0, 128, 1)', // Solid purple
          showLine: true,
        }]
      },
      options: {
        scales: {
          y: {
            title: {
              display: true,
              text: 'Time (seconds)'
            },
            beginAtZero: true
          },
          x: {
            type: 'category',
            labels: runs.map((_, index) => `Run ${index + 1}`),
            title: {
              display: true,
              text: 'Runs'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: `Scatter Plot for: ${distance} meters`
          },
          subtitle: {
            display: true,
            text: `Personal Best: ${pb} seconds | Average Time: ${avgTime.toFixed(2)} seconds` // Display the PB and average time in the subtitle
          }
        }
      }
    });
  }
}  
