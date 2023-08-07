import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import { useOutletContext } from "react-router-dom";
import ApexChart from "react-apexcharts";
import { useRecoilValue } from "recoil";
import { isDarkAtom } from "./atoms";

interface IHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

interface ChartOulet {
  coinId: string;
}
function Chart() {
  const isDark = useRecoilValue(isDarkAtom);
  const { coinId } = useOutletContext<ChartOulet>();
  const { isLoading, data } = useQuery<IHistorical[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 10000,
    }
  );

  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ApexChart
          type="candlestick" // Change chart type to CandleStick
          series={[
            {
              name: "Price",
              data:
                data?.map((price) => ({
                  x: new Date(price.time_close).getTime(),
                  y: [price.open, price.high, price.low, price.close],
                })) ?? [],
            },
          ]}
          options={{
            theme: {
              mode: isDark ? "dark" : "light",
            },
            chart: {
              height: 300,
              width: 500,
              toolbar: {
                show: false,
              },
              background: "transparent",
            },
            grid: { show: false },
            xaxis: {
              type: "datetime",
              categories: data?.map((price) => price.time_close),
              labels: { show: false },
            },
            yaxis: {
              show: false,
            },
            tooltip: {
              y: {
                formatter: (value) => `$${value.toFixed(2)}`,
              },
            },
            colors: ["#0fbcf9"],
          }}
        />
      )}
    </div>
  );
}

export default Chart;
