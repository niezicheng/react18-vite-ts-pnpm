export type TMenuItemData = {
  id: number;
  name: string;
  path: string;
  icon?: string;
  children?: TMenuItemData[];
};

export type TAntdMenuItem = TMenuItemData & {
  label: string;
  key: string;
};

export type TMap = { [propsName: string]: any };

export interface IApiResponse<T> {
  code: string;
  msg: string;
  info: T;
}
