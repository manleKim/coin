import React from "react";
import styled from "styled-components";
import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import { useOutletContext } from "react-router-dom";

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

interface IHistoricalData {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}
interface PriceProps {
  coinId?: string;
}
const High = styled.div`
  color: red;
  font-size: 40px;
`;
const Low = styled.div`
  color: blue;
  font-size: 40px;
`;
const Prices = styled.div`
  font-size: 40px;
`;
const Price = () => {
  const { coinId } = useOutletContext<PriceProps>();
  const { isLoading: priceloading, data: pricepage } = useQuery<
    IHistoricalData[]
  >(["pricepage", coinId], () => fetchCoinHistory(coinId!));
  let min = 99999999999999999;
  let max = 0;
  pricepage?.forEach((p) => {
    if (max < parseFloat(p.high)) {
      max = parseFloat(p.high);
    }
    if (min > parseFloat(p.low)) {
      min = parseFloat(p.low);
    }
  });
  return (
    <>
      <Overview>
        <High>↑ High price</High>
        <Prices>{max.toFixed(3)}</Prices>
      </Overview>
      <Overview>
        <Low>↓ Low price</Low>
        <Prices>{min.toFixed(3)}</Prices>
      </Overview>
    </>
  );
};

export default Price;
