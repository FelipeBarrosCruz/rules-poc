import { Rule, Rates, EngineArgs, IEngineResult } from "./types";
import { EngineResult } from "./engine-result";

export class Engine {
  private rules: Map<string, Rule>;
  private totalWeight: number = 0;
  private rates: Rates;
  public static MIN_RATE: number = 0;
  public static AVG_RATE: number = 60;
  public static MAX_RATE: number = 100;

  constructor({ rates }: EngineArgs) {
    this.rules = new Map<string, Rule>();
    this.rates = {
      min: rates?.min ?? Engine.MIN_RATE,
      avg: rates?.avg ?? Engine.AVG_RATE,
      max: rates?.max ?? Engine.MAX_RATE,
    };
  }

  add(rule: Rule) {
    if (this.rules.has(rule.name)) {
      throw new Error(`You can't override rule [${rule.name}]`);
    }

    this.rules.set(rule.name, rule);
    this.totalWeight += rule.weight;

    return this;
  }

  async execute(): Promise<IEngineResult> {
    const rules = Array.from(this.rules, ([_, value]) => value).sort(
      (a, b) =>
        (a?.order ?? Number.MAX_SAFE_INTEGER) -
        (b?.order ?? Number.MAX_SAFE_INTEGER)
    );

    const queue = rules.map(async (rule: Rule) => {
      let status = false;
      let reason = null;

      try {
        status = await rule.condition();
      } catch (error: any) {
        reason = error;
      } finally {
        const result = Object.assign(
          { status, weight: rule.weight },
          reason ? { reason } : {}
        );
        return rule.consequence ? await rule.consequence(result) : result;
      }
    });

    const consequences = await Promise.all(queue);
    return new EngineResult(this.totalWeight, this.rates, consequences);
  }
}
