import { setTimeout } from "timers/promises";
import { Engine, Consequence } from "./src";

const engine = new Engine({ rates: { min: 40, avg: 60, max: 100 } });

engine
  .add({
    name: "one",
    weight: 2,
    async condition() {
      console.log("condicao de %s", this.name);
      await setTimeout(2000);
      throw new Error(`Erro de ${this.name}`);
    },
    async consequence(args: Consequence) {
      console.log("consequencia de %s", this.name);
      args.reason = "POR_QUE_EU_QUIS";
      return args;
    },
  })
  .add({
    name: "two",
    weight: 2,
    order: 0,
    condition() {
      console.log("condicao de %s", this.name);
      return true;
    },
    consequence(args) {
      console.log("consequencia de %s", this.name);
      return args;
    },
  })
  .add({
    name: "three",
    weight: 2,
    order: 0,
    condition() {
      console.log("condicao de %s", this.name);
      return true;
    },
    consequence(args) {
      console.log("consequencia de %s", this.name);
      return args;
    },
  })
  .add({
    name: "four",
    weight: 2,
    order: 0,
    condition() {
      console.log("condicao de %s", this.name);
      throw new Error(`Erro de ${this.name}`);
    },
    consequence(args) {
      console.log("consequencia de %s", this.name);
      return args;
    },
  });

engine.add({
  name: "five",
  weight: 2,
  order: 0,
  condition() {
    console.log("condicao de %s", this.name);
    throw new Error(`Erro de ${this.name}`);
  },
  consequence(args) {
    console.log(
      "consequencia de %s \n pela razão de %s",
      this.name,
      args.reason
    );
    return args;
  },
});

(async () => {
  const result = await engine.execute();
  console.log("\n\n\n-----------------------------------------");
  console.log("Score is %s", result.getScore());
  console.log("Weight in percent is %s%", result.getWeight());
  console.log("-----------------------------------------\n\n\n");
})().catch(console.error);
