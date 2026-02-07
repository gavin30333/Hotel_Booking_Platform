import { useCallback, useEffect } from 'react';
import { useQueryStore } from '@/store/useQueryStore';
import { TabType, SearchParams } from '@/types/query.types';

export const useQueryForm = (defaultTab?: TabType) => {
  const activeTab = useQueryStore(state => state.activeScene);
  const formData = useQueryStore(state => state.scenes[state.activeScene]);
  const setActiveScene = useQueryStore(state => state.setActiveScene);
  const updateActiveSceneParams = useQueryStore(state => state.updateActiveSceneParams);

  useEffect(() => {
    if (defaultTab) {
      setActiveScene(defaultTab);
    }
  }, [defaultTab, setActiveScene]);

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
