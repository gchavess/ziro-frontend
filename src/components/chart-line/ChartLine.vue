<template>
  <Line
    class="h-full"
    id="chart-line"
    :options="chartOptions"
    :data="chartData"
  />
</template>

<script lang="ts">
import { formatCurrencyBRL } from "@/utils/moeda/MoedaUtil";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "vue-chartjs";
import { Component, Prop, Vue } from "vue-facing-decorator";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement
);

@Component({
  components: {
    Line,
  },
})
export default class ChartLine extends Vue {
  @Prop({ type: Array, required: true })
  public labels!: string[];

  @Prop({
    type: Array,
    default: () => [
      {
        data: [40, 20, 12],
        borderColor: "#42A5F5",
        backgroundColor: "rgba(66,165,245,0.2)",
        fill: true,
        tension: 0.4, // ← suaviza a linha (0 = reta, 1 = bem curva)
      },
    ],
  })
  public datasets!: {
    data: number[];
    borderColor?: string;
    backgroundColor?: string;
    fill?: boolean;
    tension?: number;
  }[];

  public get chartData() {
    return {
      labels: this.labels,
      datasets: this.datasets?.map((dataset) => ({
        ...dataset,
        fill: true,
        borderColor: dataset.backgroundColor,
        tension: 0.5,
      })),
    };
  }

  public chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        ticks: {
          callback: (value: string) => formatCurrencyBRL(Number(value)),
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (context: { dataset: { label: string } }[]) => {
            return context[0].dataset.label;
          },
          afterTitle: (context: { label: string }[]) => {
            return "Período: " + context[0].label;
          },
          label: (context: { raw: number }) => {
            const value = context.raw ?? 0;

            return [`${formatCurrencyBRL(Number(value))}`];
          },
        },
      },
    },
  };
}
</script>
