import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-simulator-dashboard-Main',
  templateUrl: './simulator-dashboard-Main.component.html',
  styleUrls: ['./simulator-dashboard-Main.component.css']
})
export class SimulatorDashboardMainComponent implements OnInit {

  public shares = [];
  public data = [];
  public changeDetectorRef;

  public worker;

  public attributes = { attributeList:
                        [{ levels: [2, 3, 4], type: 'Interpolation', name: "Price" },
                         { levels: ['UPC', 'Ziggo'], type: 'Category', name: "Provider" }]
                      };

  public products = [
    { attributeData: ['2.5', '1'], distribution: 1, productEnabled: true, weight: 1, productOrder: 1 },
    { attributeData: ['2', '2'], distribution: 1, productEnabled: true, weight: 1, productOrder: 2 },
    { attributeData: ['3.5', '1'], distribution: 1, productEnabled: true, weight: 1, productOrder: 3 },
    { attributeData: ['4', '2'], distribution: 1, productEnabled: true, weight: 1, productOrder: 4 },
    { attributeData: ['2', '1'], distribution: 1, productEnabled: true, weight: 1, productOrder: 5 },
    { attributeData: ['3.5', '2'], distribution: 1, productEnabled: true, weight: 1, productOrder: 6 },
    { attributeData: ['2', '1'], distribution: 1, productEnabled: true, weight: 1, productOrder: 7 },
    { attributeData: ['2.5', '2'], distribution: 1, productEnabled: true, weight: 1, productOrder: 8 },
    { attributeData: ['3.5', '1'], distribution: 1, productEnabled: true, weight: 1, productOrder: 9 },
    { attributeData: ['4', '2'], distribution: 1, productEnabled: true, weight: 1, productOrder: 10 }
  ];

  constructor(changedDetectorRef : ChangeDetectorRef) {
    this.changeDetectorRef = changedDetectorRef;
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  calculateShares(event) {
    var metadata = {
      exponent: 1,
      activeCalculation: 'sop',
      noneEnabled: false,
      shareScaling: 100
    };

    var respondents = [
      { utilityData: ['3', '4', '5', '6', '7'], filterData: [] },
      { utilityData: ['2', '3', '4', '5', '2'], filterData: [] },
      { utilityData: ['5', '4', '2', '3', '1'], filterData: [] },
      { utilityData: ['1', '2', '5', '4', '7'], filterData: [] },
      { utilityData: ['7', '4', '2', '2', '4'], filterData: [] },
      { utilityData: ['3', '3', '5', '3', '7'], filterData: [] }    ];

    var selectedFilter = [];

    var selectedWeights = { productWeights: [0.4, 0.2, 1.8, 1.6, 1.5, 0.5, 0.8, 1.2, 1, 1], respondentWeights: [0.6, 1.4, 1.3, 1.2, 0.7, 0.8] };

    this.worker.postMessage(['init', metadata, respondents, this.attributes, this.products, selectedFilter, selectedWeights]);
  }

  ngOnInit() {
    // Generate test data
    for (let y = 0; y < 100; y++) {
      this.data[y] = { id: y,input: [], output: []};
      for (let x = 0; x < 5; x++) {
        this.data[y].input[x] = { value: Math.random() };
      }
      for (let x = 0; x < 5; x++) {
        this.data[y].output[x] = { value: Math.random() };
      }
    }

    this.worker = new Worker('assets/workers/sharecalculation.js');
    this.worker.onmessage = (result) => {
      if (result.data.type === 'result') {
        this.shares = result.data.message;

        // Manually trigger change detection because .onmessage isn't in zone.js
        this.changeDetectorRef.detectChanges();
      }
    };

    var metadata = {
      exponent: 1,
      activeCalculation: 'sop',
      noneEnabled: false,
      shareScaling: 100
    };

    var respondents = [
      { utilityData: ['3', '4', '5', '6', '7'], filterData: [] },
      { utilityData: ['2', '3', '4', '5', '2'], filterData: [] },
      { utilityData: ['5', '4', '2', '3', '1'], filterData: [] },
      { utilityData: ['1', '2', '5', '4', '7'], filterData: [] },
      { utilityData: ['7', '4', '2', '2', '4'], filterData: [] },
      { utilityData: ['3', '3', '5', '3', '7'], filterData: [] }    ];

    var selectedFilter = [];

    var selectedWeights = { productWeights: [0.4, 0.2, 1.8, 1.6, 1.5, 0.5, 0.8, 1.2, 1, 1], respondentWeights: [0.6, 1.4, 1.3, 1.2, 0.7, 0.8] };

    this.worker.postMessage(['init', metadata, respondents, this.attributes, this.products, selectedFilter, selectedWeights]);

  }

}
