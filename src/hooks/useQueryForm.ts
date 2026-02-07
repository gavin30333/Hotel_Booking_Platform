import { useCallback } from 'react';
import { useQueryStore } from '@/store/useQueryStore';
import { TabType, SearchParams } from '@/types/query.types';

export const useQueryForm = () => {
  const activeTab = useQueryStore(state => state.activeScene);
  const formData = useQueryStore(state => state.scenes[state.activeScene]);
  const setActiveScene = useQueryStore(state => state.setActiveScene);
  const updateActiveSceneParams = useQueryStore(state => state.updateActiveSceneParams);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveScene(tab);
  }, [setActiveScene]);

  const updateField = useCallback((key: keyof SearchParams, value: any) => {
    updateActiveSceneParams({ [key]: value });
  }, [updateActiveSceneParams]);

  return {
    activeTab,
    formData,
    handleTabChange,
    updateField
  };
};
