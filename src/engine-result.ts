import { Rates, Consequence, SCORES, IEngineResult } from './types';

export class EngineResult implements IEngineResult {
  private totalWeight: number = 0;
  private rates: Rates;
  private consequences: Consequence[];
  private weight!: number;
  private score!: SCORES;
  
  constructor(totalWeight: number, rates: Rates, consequences: Consequence[]) {
    this.totalWeight = totalWeight;
    this.rates = rates;
    this.consequences = consequences;
    this.setConsequencesWeight();
    this.setScore();
  }

  private setConsequencesWeight() {
    this.weight = Math.floor(this.consequences
      .reduce((weight: number, consequence: Consequence) => consequence.status ? weight + consequence.weight : weight, 0)
      * 100 / this.totalWeight);
  }

  private setScore() {
    if (this.weight <= this.rates.min) {
      return this.score = SCORES.MAX
    }

    if (this.weight > this.rates.min && this.weight <= this.rates.avg) {
      return this.score = SCORES.AVG
    }

    this.score = SCORES.LOW
  }

  public getWeight(): number {
    return this.weight;
  }

  public getScore(): SCORES {
    return this.score;
  }
}