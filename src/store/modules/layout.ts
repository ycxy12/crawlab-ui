import {plainClone} from '@/utils/object';
import {normalizeTree} from '@/utils/tree';
import {getDefaultMenuItems} from '@/router';
import {computed} from "vue";

export default {
  namespaced: true,
  state: {
    // sidebar
    sidebarCollapsed: false,
    menuItems: getDefaultMenuItems(),

    // tabs view
    activeTabId: undefined,
    maxTabId: 0,
    tabs: [] as Tab[],
    draggingTab: undefined,
    targetTab: undefined,
    isTabsDragging: false,

    // nav
    navVisibleFn: (path: string) => true,

    // detail
    detailTabVisibleFn: (ns: StoreNamespace, tab: NavItem) => true,

    // action
    actionVisibleFn: (target: string, action: string) => true,
  },
  getters: {
    tabs: state => {
      const {draggingTab, targetTab, tabs} = state;
      if (!draggingTab || !targetTab) return tabs;
      const orderedTabs = plainClone(state.tabs) as Tab[];
      const draggingIdx = orderedTabs.map(t => t.id).indexOf(draggingTab?.id);
      const targetIdx = orderedTabs.map(t => t.id).indexOf(targetTab?.id);
      if (draggingIdx === -1 || targetIdx === -1) return tabs;
      orderedTabs.splice(draggingIdx, 1);
      orderedTabs.splice(targetIdx, 0, draggingTab);
      return orderedTabs;
    },
    activeTab: state => {
      const {tabs, activeTabId} = state;
      if (activeTabId === undefined) return;
      return tabs.find(d => d.id === activeTabId);
    },
    sidebarMenuItems: (state, getters, rootState) => {
      return state.menuItems
        .filter(d => !d.hidden)
        .filter(d => {
          if (!d.path) return false;
          if ([
            '/notifications',
            '/environments',
            '/system',
            '/deps',
          ].includes(d.path) && rootState.common.systemInfo?.edition !== 'global.edition.pro') {
            return false;
          }
          return true;
        })
        .filter(d => {
          if (!state.navVisibleFn) return true;
          if (!d.path) return true;
          return state.navVisibleFn(d.path);
        });
    },
    normalizedMenuItems: state => normalizeTree<MenuItem>(state.menuItems),
  },
  mutations: {
    setMenuItems(state: LayoutStoreState, items: MenuItem[]) {
      state.menuItems = items;
    },
    setSideBarCollapsed(state: LayoutStoreState, value: boolean) {
      state.sidebarCollapsed = value;
    },
    setTabs(state: LayoutStoreState, tabs: Tab[]) {
      state.tabs = tabs;
    },
    setActiveTabId(state: LayoutStoreState, id: number) {
      state.activeTabId = id;
    },
    addTab(state: LayoutStoreState, tab: Tab) {
      if (tab.id === undefined) tab.id = ++state.maxTabId;
      state.tabs.push(tab);
    },
    updateTab(state: LayoutStoreState, tab: Tab) {
      const {tabs} = state;
      const idx = tabs.findIndex(d => d.id === tab.id);
      if (idx !== -1) {
        state.tabs[idx] = tab;
      }
    },
    removeAllTabs(state: LayoutStoreState) {
      state.tabs = [];
    },
    removeTab(state: LayoutStoreState, tab: Tab) {
      if (tab.id === undefined) return;
      const idx = state.tabs.findIndex(d => d.id === tab.id);
      if (idx === -1) return;
      state.tabs.splice(idx, 1);

      // set active tab
      // if (idx > state.tabs.length - 1) {
      //
      // }
    },
    setDraggingTab(state: LayoutStoreState, tab: Tab) {
      state.draggingTab = tab;
    },
    resetDraggingTab(state: LayoutStoreState) {
      state.draggingTab = undefined;
    },
    setTargetTab(state: LayoutStoreState, tab: Tab) {
      state.targetTab = tab;
    },
    resetTargetTab(state: LayoutStoreState) {
      state.targetTab = undefined;
    },
    setIsTabsDragging(state: LayoutStoreState, value: boolean) {
      state.isTabsDragging = value;
    },
    setNavVisibleFn(state: LayoutStoreState, fn: (path: string) => boolean) {
      state.navVisibleFn = fn;
    },
    setDetailTabVisibleFn(state: LayoutStoreState, fn: (ns: StoreNamespace, tab: NavItem) => boolean) {
      state.detailTabVisibleFn = fn;
    },
    setActionVisibleFn(state: LayoutStoreState, fn: (target: string, action: string) => boolean) {
      state.actionVisibleFn = fn;
    },
  },
  actions: {}
} as LayoutStoreModule;
