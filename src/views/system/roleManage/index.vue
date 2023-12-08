<template>
  <div class="table-box">
    <ProTable ref="proTable" title="角色列表" row-key="id" :indent="20" :columns="columns" :request-api="getSysRoleList">
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增角色 </el-button>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)"> 编辑 </el-button>
        <el-button type="primary" link :icon="Delete" @click="handlerDestroy(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <EditDrawer ref="editDrawerRef" />
  </div>
</template>

<script setup lang="tsx" name="systemRole">
import { ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { getSysRoleList, changeSysRoleStatus, addSysRole, updateSysRole, destroySysRole } from "@/api/modules/sys/role";
import { enableStatus } from "@/utils/dict";
import { ISysRole } from "@/api/interface/sys/role";
import { useHandleData } from "@/hooks/useHandleData";
import EditDrawer from "./components/edit.vue";
import { getMenuList } from "@/api/modules/sys/menu";
import { reactive } from "vue";

const proTable = ref();

// 表格配置项
const columns: ColumnProps[] = [
  { prop: "id", label: "ID" },
  { prop: "name", label: "角色名称", search: { el: "input" } },
  { prop: "uniqueKey", label: "唯一标识", search: { el: "input" } },
  { prop: "remark", label: "备注" },
  {
    prop: "status",
    label: "角色状态",
    enum: enableStatus,
    fieldNames: { label: "userLabel", value: "userStatus" },
    render: scope => {
      return (
        <>
          {
            <el-switch
              model-value={scope.row.status}
              active-text={scope.row.status ? "启用" : "禁用"}
              active-value={1}
              inactive-value={0}
              onClick={() => changeStatus(scope.row)}
            />
          }
        </>
      );
    }
  },
  { prop: "createdAt", label: "创建时间" },
  { prop: "updatedAt", label: "更新时间" },
  { prop: "operation", label: "操作", width: 150, fixed: "right" }
];

// 切换用户状态
const changeStatus = async (row: ISysRole.SysRole) => {
  await useHandleData(changeSysRoleStatus, { id: row.id, status: row.status == 1 ? 0 : 1 }, `切换【${row.name}】角色状态`);
  proTable.value?.getTableList();
};

// 删除菜单
const handlerDestroy = async (params: ISysRole.SysRole) => {
  await useHandleData(destroySysRole, { id: params.id }, `删除【${params.name}】角色`);
  proTable.value?.getTableList();
};

let perms = reactive<Menu.MenuOptions[]>([]);
const getPerms = async () => {
  const { data } = await getMenuList({ title: "" });
  perms = data;
};

// 打开 drawer(新增、查看、编辑)
const editDrawerRef = ref<InstanceType<typeof EditDrawer> | null>(null);
const openDrawer = async (title: string, row: Partial<ISysRole.SysRole> = {}) => {
  if (!perms.length) {
    await getPerms();
  }
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addSysRole : title === "编辑" ? updateSysRole : undefined,
    getTableList: proTable.value?.getTableList,
    perms: perms
  };
  editDrawerRef.value?.acceptParams(params);
};
</script>
