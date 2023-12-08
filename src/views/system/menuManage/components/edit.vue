<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}菜单`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="dynamicRules"
      :disabled="drawerProps.isView"
      :model="{ ...drawerProps.row, ...menuMeta }"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="菜单类型" prop="type">
        <el-radio-group v-model="drawerProps.row.type" @change="menuTypeChange">
          <el-radio border :label="1">目录</el-radio>
          <el-radio border :label="2">菜单</el-radio>
          <el-radio border :label="3">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="上级菜单" prop="pid">
        <el-tree-select
          v-model="drawerProps.row!.pid"
          node-key="id"
          highlight-current
          :check-strictly="true"
          :props="defaultProps"
          :data="drawerProps.topMenu"
          :expand-on-click-node="false"
          :check-on-click-node="true"
        />
      </el-form-item>
      <el-form-item label="菜单标题" prop="title">
        <el-input v-model="menuMeta.title" placeholder="请填写菜单标题" clearable></el-input>
      </el-form-item>
      <div v-show="drawerProps.row.type == 2">
        <el-form-item prop="name">
          <template #label>
            <span>菜单标识</span>
            <el-tooltip
              class="item"
              effect="dark"
              placement="top"
              content="必须是前端vue页面的name,例如<script setup lang='ts' name='systemMenu'"
            >
              <QuestionFilled style="width: 1em; margin-right: 8px" />
            </el-tooltip>
            <span>:</span>
          </template>
          <el-input v-model="drawerProps.row.name" clearable></el-input>
        </el-form-item>

        <el-form-item label="页面路由" prop="path">
          <el-input v-model="drawerProps.row.path" clearable></el-input>
        </el-form-item>

        <el-form-item label="组件路径" prop="component">
          <el-input v-model="drawerProps.row.component as string" clearable></el-input>
        </el-form-item>

        <el-form-item label="外链地址" prop="redirect">
          <el-input v-model="drawerProps.row.redirect" clearable></el-input>
        </el-form-item>

        <el-form-item label="是否固定" prop="is_affix">
          <el-radio-group v-model="menuMeta.isAffix">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否全屏" prop="is_full">
          <el-radio-group v-model="menuMeta.isFull">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item prop="is_keepalive">
          <template #label>
            <span>是否缓存</span>
            <el-tooltip
              class="item"
              effect="dark"
              placement="top"
              content="选择是在切换tab页面后,返回页面不会重新加载,保留上次浏览记录,否则会重新加载"
            >
              <QuestionFilled style="width: 1em; margin-right: 8px" />
            </el-tooltip>
            <span>:</span>
          </template>
          <el-radio-group v-model="menuMeta.isKeepAlive">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <div v-show="drawerProps.row.type != 3">
        <el-form-item label="是否隐藏" prop="is_hide">
          <el-radio-group v-model="menuMeta.isHide">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <SelectIcon v-model:icon-value="menuMeta.icon" />
        </el-form-item>
        <el-form-item label="序号" prop="sort">
          <el-input-number v-model="drawerProps.row.sort" />
        </el-form-item>
      </div>
      <div v-show="drawerProps.row.type == 3">
        <el-form-item label="权限标识" prop="perms">
          <el-input v-model="drawerProps.row.perms" placeholder="后端接口地址" clearable></el-input>
        </el-form-item>
      </div>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="menuEditDrawer">
import { ref, computed } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import { TreeOptionProps } from "element-plus/es/components/tree/src/tree.type";
import { TreeNodeData } from "element-plus/es/components/tree-v2/src/types";
import SelectIcon from "@/components/SelectIcon/index.vue";
import { QuestionFilled } from "@element-plus/icons-vue";

const dirRules = {
  type: [{ required: true, message: "请选择类型" }],
  title: [{ required: true, message: "请填写菜单标题" }]
};

const menuRules = {
  type: [{ required: true, message: "请选择类型" }],
  name: [{ required: true, message: "请填写菜单标识" }],
  title: [{ required: true, message: "请填写菜单标题" }],
  path: [{ required: true, message: "请填写页面路由" }],
  component: [{ required: true, message: "请填写组件路径" }]
};

const buttonRules = {
  type: [{ required: true, message: "请选择类型" }],
  pid: [{ required: true, message: "请选择类型" }],
  title: [{ required: true, message: "请填写菜单标题" }],
  perms: [{ required: true, message: "请填写权限标识" }]
};

const rules = ref(dirRules);
const dynamicRules = computed(() => rules.value);
const menuTypeChange = (value: string | number | boolean) => {
  switch (value as number) {
    case 1:
      rules.value = dirRules;
      return;
    case 2:
      rules.value = menuRules;
      return;
    case 3:
      rules.value = buttonRules;
      return;
  }
};

const defaultProps: TreeOptionProps = {
  children: "children",
  label: (data: TreeNodeData) => {
    return data.meta.title;
  }
};

// 初始化菜单meta
const initMenuMeta = (): Menu.MetaProps => {
  return {
    icon: "",
    title: "",
    isHide: false,
    isFull: false,
    isAffix: false,
    isKeepAlive: false
  };
};

const menuMeta = ref<Menu.MetaProps>(initMenuMeta());

interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<Menu.MenuOptions>;
  topMenu: Menu.MenuOptions[];
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  title: "",
  isView: false,
  row: {},
  topMenu: []
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
  if (drawerProps.value.row.meta == undefined) {
    drawerProps.value.row.type = 1;
    menuMeta.value = initMenuMeta();
  } else {
    menuTypeChange(drawerProps.value.row.type as number);
    menuMeta.value = drawerProps.value.row.meta;
  }
  // 过滤菜单
  if (drawerProps.value.topMenu.length > 0) {
    drawerProps.value.topMenu = drawerProps.value.topMenu.map(menu => filterMenu(menu)).filter(Boolean);
    drawerProps.value.topMenu.unshift({
      id: 0,
      meta: {
        title: "顶级菜单",
        icon: "",
        isHide: false,
        isFull: false,
        isAffix: false,
        isKeepAlive: false
      },
      type: 1,
      path: "",
      name: ""
    });
  }
};

/**
 * 删除按钮节点
 * @param menu
 */
const filterMenu = (menu: Menu.MenuOptions) => {
  // 递归处理子节点
  if (menu.children) {
    menu.children = menu.children.map((child: Menu.MenuOptions) => filterMenu(child)).filter(Boolean);
  }
  // 删除 type 等于 3 的节点
  menu.children = (menu.children || []).filter(child => child.type !== 3);
  return menu;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = async () => {
  drawerProps.value.row.meta = menuMeta.value;
  try {
    // 等待表单验证完成
    await ruleFormRef.value!.validate();
    // 表单验证通过后执行提交逻辑
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
