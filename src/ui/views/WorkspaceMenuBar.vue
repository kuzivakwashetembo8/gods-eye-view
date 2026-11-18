<script setup>
const menus = [
 {label:'File',items:[{label:'New scene',action:'new-scene',shortcut:'Ctrl+N'},{label:'Import scenes…',action:'import-scenes'},{label:'Export scenes…',action:'export-scenes',shortcut:'Ctrl+S'}]},
 {label:'View',items:[{label:'Visual presets',children:[{label:'Normal',action:'style-normal',shortcut:'1'},{label:'CRT',action:'style-retro',shortcut:'2'},{label:'Night vision',action:'style-surveillance',shortcut:'3'},{label:'Thermal',action:'style-thermal',shortcut:'4'},{label:'Anime',action:'style-anime',shortcut:'5'},{label:'Noir',action:'style-noir',shortcut:'6'}]},{label:'Location',action:'location'},{label:'Context inspector',action:'context'},{label:'Data layers',action:'data-layers'}]},
 {label:'Explore',items:[{label:'Contacts',action:'contacts'},{label:'Space missions',action:'missions'},{label:'Weather panel',action:'weather'},{label:'News panel',action:'news'},{label:'Recent imagery',action:'imagery'}]},
 {label:'Layers',items:[{label:'Data layers',action:'data-layers'},{label:'Utilities',action:'utilities'},{label:'CCTV coverage',action:'cctv'},{label:'Street level',action:'street-level'}]},
 {label:'Tools',items:[{label:'Scene authoring',action:'authoring'},{label:'AI chat',action:'chat'},{label:'Voice assistant',action:'voice'},{label:'Provider settings',action:'provider-settings'}]},
 {label:'Help',items:[{label:'Configure API keys…',action:'provider-settings'},{label:'Return to globe home',action:'home'}]}
];
function click(selector){const el=document.querySelector(selector);if(el&&!el.disabled&&el.getAttribute('aria-disabled')!=='true')el.click();}
function openPanel(id){const panel=document.getElementById(id);if(!panel)return;const collapsed=panel.classList.contains('collapsed')||panel.classList.contains('ui-panel--collapsed');if(collapsed)panel.querySelector('[data-collapse-target]')?.click();}
function run(action){
 switch(action){
 case 'new-scene':click('#scene-new-btn');break;
 case 'import-scenes':click('#scene-import-btn');break;
 case 'export-scenes':click('#scene-export-btn');break;
 case 'style-normal':case 'style-retro':case 'style-surveillance':case 'style-thermal':case 'style-anime':case 'style-noir':click('#style-buttons [data-style="'+action.slice(6)+'"]');break;
 case 'location':if(document.querySelector('#location-bar.collapsed'))click('#location-bar-toggle');break;
 case 'context':openPanel('global-context-panel');break;
 case 'data-layers':openPanel('data-panel');break;
 case 'utilities':openPanel('utilities-panel');break;
 case 'cctv':openPanel('cctv-panel');break;
 case 'street-level':openPanel('street-level-panel');break;
 case 'authoring':openPanel('scene-panel');break;
 case 'contacts':openPanel('global-context-panel');click('#global-context-flights-btn');break;
 case 'missions':openPanel('global-context-panel');click('#global-context-missions-btn');break;
 case 'weather':openPanel('weather-panel');break;
 case 'news':openPanel('news-panel');break;
 case 'imagery':openPanel('recent-imagery-panel');break;
 case 'chat':click('#gev-chat-button');break;
 case 'voice':click('#gev-voice-button');break;
 case 'provider-settings':click('#key-setup-chip');break;
 case 'home':click('.title-logo');break;
 }
}
</script>
<template>
<nav id="gev-workspace-menubar" aria-label="Workspace menu">
 <span class="gev-menu-brand" aria-hidden="true">GEV</span>
 <ul class="gev-menu-root" role="menubar">
  <li v-for="menu in menus" :key="menu.label" class="gev-menu-group" role="none">
   <button class="gev-menu-trigger" type="button" role="menuitem" aria-haspopup="true">{{menu.label}}</button>
   <ul class="gev-menu-popup" role="menu">
    <li v-for="item in menu.items" :key="item.label" class="gev-menu-item" role="none">
     <button v-if="item.children" class="gev-menu-action has-submenu" type="button" role="menuitem" aria-haspopup="true"><span>{{item.label}}</span><span class="gev-menu-chevron">›</span></button>
     <button v-else class="gev-menu-action" type="button" role="menuitem" @click="run(item.action)"><span>{{item.label}}</span><kbd v-if="item.shortcut">{{item.shortcut}}</kbd></button>
     <ul v-if="item.children" class="gev-menu-popup gev-menu-subpopup" role="menu">
      <li v-for="child in item.children" :key="child.action" role="none"><button class="gev-menu-action" type="button" role="menuitem" @click="run(child.action)"><span>{{child.label}}</span><kbd v-if="child.shortcut">{{child.shortcut}}</kbd></button></li>
     </ul>
    </li>
   </ul>
  </li>
 </ul>
 <span class="gev-menu-title">God’s Eye View</span>
</nav>
</template>
