export type SettingDto = {
  priceWater: number;
  priceLight: number;
};

export const toSettingDto = ({
  priceWater,
  priceLight,
}: {
  priceWater: number;
  priceLight: number;
}): SettingDto => {
  return {
    priceWater: priceWater,
    priceLight: priceLight,
  };
};
