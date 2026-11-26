import './styles/main.css';
import { initHubHeader } from './components/header.js';
import { initFastLocation } from './modules/fastlocation/controller.js';
import { initMqttClient } from './modules/mqtt/controller.js';

function bootstrap() {
  const headerContainer = document.getElementById('appHubHeader');
  const fastLocationContainer = document.getElementById('moduleFastLocation');
  const mqttContainer = document.getElementById('moduleMqttClient');

  let activeTab = window.location.hash === '#mqtt' ? 'mqtt' : 'fastlocation';
  let fastLocationApi = null;
  let mqttApi = null;

  function applyTab(tab, updateHash = true) {
    activeTab = tab === 'mqtt' ? 'mqtt' : 'fastlocation';
    const isFast = activeTab === 'fastlocation';
    fastLocationContainer.classList.toggle('hidden', !isFast);
    mqttContainer.classList.toggle('hidden', isFast);
    mqttContainer.classList.toggle('flex', !isFast);
    if (updateHash) {
      const targetHash = isFast ? '#fastlocation' : '#mqtt';
      if (window.location.hash !== targetHash) window.history.replaceState(null, '', targetHash);
    }
    if (isFast && fastLocationApi) fastLocationApi.onTabShow();
    else if (!isFast && mqttApi) mqttApi.onTabShow();
  }

  const headerApi = initHubHeader(headerContainer, {
    onTabChange(tab) { applyTab(tab, true); },
  });
  fastLocationApi = initFastLocation(fastLocationContainer);
  mqttApi = initMqttClient(mqttContainer, {
    onStatusChange(status) { headerApi.setMqttStatus(status); },
    onPrintModeChange(isPrintMode) { headerApi.setVisible(!isPrintMode); },
  });
  headerApi.setActiveTab(activeTab);
  applyTab(activeTab, false);

  window.addEventListener('hashchange', () => {
    const nextTab = window.location.hash === '#mqtt' ? 'mqtt' : 'fastlocation';
    if (nextTab !== activeTab) {
      headerApi.setActiveTab(nextTab);
      applyTab(nextTab, false);
    }
  });
}
if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', bootstrap);
else bootstrap();