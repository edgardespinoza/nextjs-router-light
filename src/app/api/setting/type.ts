export type SettingDto = {
  measure: number;
  totalPrice: number;
  priceKwh: number;
};

export const toSettingDto = ({
  measure,
  priceKwh,
  totalPrice
}: {
  measure: number;
  priceKwh: number;
  totalPrice: number;
}): SettingDto => {
  return {
    measure: measure,
    priceKwh: priceKwh,
    totalPrice: totalPrice
  };
};
