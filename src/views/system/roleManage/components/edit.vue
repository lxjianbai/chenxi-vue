<template>
  <el-drawer
    v-model="drawerVisible"
    :destroy-on-close="true"
    size="450px"
    :title="`${drawerProps.title}角色`"
    @opened="initChooseId(drawerProps.row)"
  >
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="drawerProps.row.name" placeholder="请填写角色名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="唯一标识" prop="uniqueKey">
        <el-input v-model="drawerProps.row.uniqueKey" placeholder="请填写角色唯一标识" clearable></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="drawerProps.row.remark" placeholder="角色备注" clearable></el-input>
      </el-form-item>
      <el-form-item label="角色状态" prop="is_hide">
        <el-radio-group v-model="drawerProps.row.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="角色权限" prop="menuIds">
        <el-tree
          ref="permsRef"
          :data="drawerProps.perms"
          :props="permsProps"
          node-key="id"
          show-checkbox
          default-expand-all
          highlight-current
          check-on-click-node
          class="demo-radius"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="roleEditDrawer">
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { ISysRole } from "@/api/interface/sys/role";
import { TreeNodeData, TreeOptionProps } from "element-plus/es/components/tree/src/tree.type";

const rules = reactive({
  name: [{ required: true, message: "请填写角色名称" }],
  uniqueKey: [{ required: true, message: "请填写角色唯一标识" }],
  menuIds: [{ required: true, message: "请选择角色权限" }]
});

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<ISysRole.SysRole>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
  perms: Menu.MenuOptions[];
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  title: "",
  isView: false,
  row: {},
  perms: []
});

const permsRef = ref();
const permsProps: TreeOptionProps = {
  label: (data: TreeNodeData) => {
    const row = data as Menu.MenuOptions;
    return row.meta.title;
  }
};

/**
 * 初始化角色选择器
 * @param row
 */
const initChooseId = (row: Partial<ISysRole.SysRole>) => {
  let chooseId: number[] | undefined = [];
  if (row != undefined && row.menuIds != "") {
    chooseId = row.menuIds?.split(",").map(Number);
  }
  if (chooseId == undefined) {
    return;
  }
  chooseId.forEach((i: any) => {
    const node = permsRef.value.getNode(i);
    console.log(node);
    if (node.isLeaf) {
      permsRef.value.setChecked(node, true);
    }
  });
};

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = async () => {
  const checkedKeys = permsRef.value.getCheckedKeys();
  const halfCheckedKeys = permsRef.value.getHalfCheckedKeys();
  const getCheckedKeys = checkedKeys.concat(halfCheckedKeys).join(",");
  try {
    // 等待表单验证完成
    await ruleFormRef.value!.validate();
    // 表单验证通过后执行提交逻辑
    drawerProps.value.row.menuIds = getCheckedKeys;
    await drawerProps.value.api!(drawerProps.value.row);
    ElMessage.success({ message: `${drawerProps.value.title}菜单成功！` });
    drawerProps.value.getTableList!();
    drawerVisible.value = false;
  } catch (error) {
    console.log(error);
  }
};

defineExpose({
  acceptParams
});
</script>
