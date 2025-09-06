<template>
  <Bar
    class="h-full"
    id="chart-bar"
    :options="chartOptions"
    :data="chartData"
  />
</template>

<script lang="ts">
import { formatCurrencyBRL } from "@/utils/moeda/MoedaUtil";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "vue-chartjs";
import { Component, Prop, Vue } from "vue-facing-decorator";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

@Component({
  components: {
    Bar,
  },
})
export default class ChartBar extends Vue {
  @Prop({ type: Array, required: true })
  public labels!: string[];

  @Prop({
    type: Array,
    default: () => [{ data: [40, 20, 12], backgroundColor: "#f87979" }],
  })
  public datasets!: { data: number[]; backgroundColor?: string }[];

  public get chartData() {
    return {
      labels: this.labels,
      datasets: this.datasets,
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
