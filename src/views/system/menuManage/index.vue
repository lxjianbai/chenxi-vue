<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      title="菜单列表"
      row-key="id"
      :indent="20"
      :columns="columns"
      :request-api="getMenuList"
      :pagination="false"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader>
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增菜单 </el-button>
      </template>
      <!-- 菜单图标 -->
      <template #icon="scope">
        <el-icon :size="18">
          <component :is="scope.row.meta.icon"></component>
        </el-icon>
      </template>
      <!-- 菜单操作 -->
      <template #operation="scope">
        <el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)"> 编辑 </el-button>
        <el-button type="primary" link :icon="Delete" @click="handlerDestroyMenu(scope.row)">删除</el-button>
      </template>
    </ProTable>
    <MenuEditDrawer ref="menuEditDrawerRef" />
  </div>
</template>

<script setup lang="ts" name="systemMenu">
import { ref } from "vue";
import { ColumnProps } from "@/components/ProTable/interface";
import { Delete, EditPen, CirclePlus } from "@element-plus/icons-vue";
import ProTable from "@/components/ProTable/index.vue";
import { getMenuList, addMenu, updateMenu, destroyMenu } from "@/api/modules/sys/menu";
import MenuEditDrawer from "./components/edit.vue";
import { useHandleData } from "@/hooks/useHandleData";
import { sysMenuType } from "@/utils/dict";

const proTable = ref();

// 表格配置项
const columns: ColumnProps[] = [
  { prop: "meta.title", label: "菜单名称", align: "left", search: { el: "input" } },
  {
    prop: "type",
    label: "菜单类型",
    width: 120,
    tag: true,
    enum: sysMenuType
  },
  { prop: "name", label: "菜单标识", width: 150, search: { el: "input" } },
  { prop: "meta.icon", label: "菜单图标", width: 100 },
  { prop: "perms", label: "权限标识" },
  { prop: "path", label: "菜单路由" },
  { prop: "component", label: "组件路径" },
  { prop: "operation", label: "操作", width: 150, fixed: "right" }
];

// 删除菜单
const handlerDestroyMenu = async (params: Menu.MenuOptions) => {
  await useHandleData(destroyMenu, { id: params.id }, `删除【${params.meta.title}】菜单`);
  proTable.value?.getTableList();
};

// 打开 drawer(新增、查看、编辑)
const menuEditDrawerRef = ref<InstanceType<typeof MenuEditDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<Menu.MenuOptions> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addMenu : title === "编辑" ? updateMenu : undefined,
    getTableList: proTable.value?.getTableList,
    topMenu: JSON.parse(JSON.stringify(proTable.value?.tableData))
  };
  menuEditDrawerRef.value?.acceptParams(params);
};
</script>
