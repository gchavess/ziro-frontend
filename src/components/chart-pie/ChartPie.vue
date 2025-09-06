<template>
  <Pie
    class="h-full"
    id="chart-pie"
    :options="chartOptions"
    :data="chartData"
  />
</template>

<script lang="ts">
import { formatCurrencyBRL } from "@/utils/moeda/MoedaUtil";
import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from "chart.js";
import { Pie } from "vue-chartjs";
import { Component, Prop, Vue } from "vue-facing-decorator";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

@Component({
  components: {
    Pie,
  },
})
export default class ChartPie extends Vue {
  @Prop({ type: Array, required: true })
  public labels!: string[];

  @Prop({
    type: Array,
    default: () => [
      {
        data: [40, 25, 35],
        backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"],
      },
    ],
  })
  public datasets!: {
    data: number[];
    backgroundColor?: string[]; // no pie é comum ter várias cores no array
    label: string;
  }[];

  @Prop({ type: String, default: "" })
  public periodo!: string;

  public get chartData() {
    return {
      labels: this.datasets.map((d) => d.label),
      datasets: [
        {
          data: this.datasets.map((d) => d.data.reduce((a, b) => a + b, 0)),
          backgroundColor: this.datasets.map((d) => d.backgroundColor),
        },
      ],
    };
  }

  public get chartOptions() {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        tooltip: {
          callbacks: {
            afterTitle: () => {
              return `Período: ${this.periodo}`;
            },
            label: (context: { raw: number }) => {
              const value = context.raw ?? 0;
              return `${formatCurrencyBRL(Number(value))}`;
            },
          },
        },
      },
    };
  }
}
</script>
