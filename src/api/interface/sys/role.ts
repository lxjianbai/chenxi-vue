import { ReqPage } from "@/api/interface/index";
export namespace ISysRole {
  export interface ReqSysRoleListParams extends ReqPage {
    name: string;
  }
  export interface SysRole {
    id?: number;
    name: string;
    uniqueKey: string;
    remark?: string;
    menuIds?: string;
    status: number;
    createdAt: string;
    updatedAt: string;
  }
}
