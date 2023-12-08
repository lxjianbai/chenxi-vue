import http from "@/api";
import { ISysRole } from "@/api/interface/sys/role";
import { IStatus, ResPage } from "@/api/interface/index";

/**
 * @name 角色管理模块
 */
// 获取角色列表
export const getSysRoleList = (params: ISysRole.ReqSysRoleListParams) => {
  return http.get<ResPage<ISysRole.SysRole[]>>(`/sys/role/list`, params);
};

// 更改状态
export const changeSysRoleStatus = (params: IStatus.ReqChangeStatus) => {
  return http.put(`/sys/role/status`, params);
};

// 新增菜单
export const addSysRole = (params: ISysRole.SysRole) => {
  return http.post(`/sys/role/add`, params);
};

// 更新菜单
export const updateSysRole = (params: ISysRole.SysRole) => {
  return http.put(`/sys/role/update`, params);
};

// 角色删除
export const destroySysRole = (params: { id: number }) => {
  return http.delete(`/sys/role/destroy`, params);
};
