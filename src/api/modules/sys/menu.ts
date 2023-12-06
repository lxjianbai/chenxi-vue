import http from "@/api";
import { IMenu } from "@/api/interface/sys/menu";

/**
 * @name 用户管理模块
 */
// 获取用户列表
export const getMenuList = (params: IMenu.ReqMenuParams) => {
  return http.get<Menu.MenuOptions[]>(`/sys/menu/list`, params);
};

// 新增菜单
export const addMenu = (params: Menu.MenuOptions) => {
  return http.post(`/sys/menu/add`, params);
};

// 更新菜单
export const updateMenu = (params: Menu.MenuOptions) => {
  return http.put(`/sys/menu/update`, params);
};

// 更新删除
export const destroyMenu = (params: { id: number }) => {
  return http.delete(`/sys/menu/destroy`, params);
};
