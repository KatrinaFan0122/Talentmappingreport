<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-6 font-sans">
    <!-- 卡片容器 -->
    <div 
      ref="reportRef" 
      class="bg-white w-full max-w-[420px] md:max-w-5xl rounded-[24px] shadow-xl overflow-hidden border border-slate-200 transition-all duration-300 flex flex-col"
    >
      
      <!-- 顶部 Header - 专业深色风格 -->
      <div class="bg-slate-800 p-6 md:p-8 text-white relative overflow-hidden flex-shrink-0">
        <div class="absolute top-0 right-0 p-4 opacity-10">
          <briefcase-icon :size="120" class="transform md:scale-125 origin-top-right" />
        </div>
        
        <div class="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <div class="bg-indigo-500 w-1 h-4 rounded-full"></div>
              <div class="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Talent Mapping Report</div>
            </div>
            
            <div class="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
              <h1 class="text-xl md:text-2xl lg:text-3xl font-bold leading-tight flex items-baseline whitespace-nowrap">
                岗位：
                <input 
                  v-model="jobTitle"
                  class="bg-transparent border-b border-slate-500 text-white w-full md:w-auto md:min-w-[280px] focus:outline-none focus:border-white transition-colors placeholder-slate-500 text-ellipsis pb-1"
                />
              </h1>
              
              <div class="flex items-center text-slate-300">
                <map-pin-icon :size="16" class="mr-1 text-slate-400 flex-shrink-0" />
                <span class="text-xs font-medium mr-1 whitespace-nowrap">City:</span>
                <input 
                  v-model="city"
                  class="bg-transparent border-b border-slate-500 text-white w-20 focus:outline-none focus:border-white transition-colors placeholder-slate-500 text-xs font-bold pb-1"
                />
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 text-[10px] text-slate-300 bg-slate-700/50 inline-flex px-3 py-1.5 rounded-sm backdrop-blur-sm whitespace-nowrap self-start md:self-auto border border-slate-600">
            <file-text-icon :size="10" />
            <span>CONFIDENTIAL</span>
          </div>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="p-5 md:p-8 flex-1 flex flex-col bg-slate-50/30">
        <!-- 上半部分 Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          
          <!-- 左侧专栏：市场情报 -->
          <div class="space-y-6 flex flex-col">
            
            <!-- 1. 人才分布 -->
            <div class="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div class="p-4 border-b border-slate-100 bg-slate-50/50">
                <section-header icon="users" title="Market Distribution / 人才分布" />
              </div>
              <div class="p-4 flex-1 flex flex-col">
                <!-- 图表区域 -->
                <div class="flex items-end gap-2 h-20 mb-4">
                  <div class="flex-1 h-full">
                    <bar-chart :chart-data="distData" />
                  </div>
                  <!-- 简易图例 -->
                  <div class="text-[10px] text-slate-400 flex flex-col justify-between h-full py-1">
                    <div v-for="item in distData" :key="item.name">{{ item.name }}</div>
                  </div>
                </div>

                <!-- 核心数据填空 -->
                <div class="grid grid-cols-4 gap-2 mb-4">
                  <div 
                    v-for="(item, index) in distData" 
                    :key="item.name" 
                    class="text-center bg-slate-50 rounded p-1"
                  >
                    <div class="text-[10px] text-slate-400">{{ item.name }}</div>
                    <inline-input 
                      v-model="item.count"
                      width="w-full"
                      class-name="text-indigo-600 text-sm border-transparent"
                    />
                  </div>
                </div>

                <!-- 专业文字分析区域 -->
                <div class="bg-blue-50/50 rounded-lg p-3 border border-blue-100 mt-auto">
                  <auto-resize-textarea 
                    v-model="distAnalysis"
                    class-name="text-xs text-slate-700 leading-relaxed text-justify"
                    placeholder="在此输入专业的人才画像分析..."
                  />
                </div>
              </div>
            </div>

            <!-- 2. 薪资填空 -->
            <div class="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div class="p-4 border-b border-slate-100 bg-slate-50/50">
                <section-header icon="dollar-sign" title="Compensation / 薪酬分析 (K/月)" />
              </div>
              <div class="p-4 flex-1 flex flex-col relative">
                <!-- 背景装饰 -->
                <div class="absolute top-16 right-4 w-24 h-12 opacity-10 pointer-events-none">
                  <area-chart :chart-data="salaryChartData" />
                </div>

                <div class="text-sm text-slate-700 leading-snug space-y-4">
                  <div class="flex items-center justify-between text-xs md:text-sm bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <div class="flex flex-col">
                      <span class="text-[10px] text-slate-400 uppercase">Min - Max</span>
                      <div>
                        <span class="font-bold text-slate-700">¥</span>
                        <inline-input 
                          v-model="salaryStats.min" 
                          width="w-8" 
                          class-name="border-transparent text-slate-800" 
                        />
                        <span class="mx-1 text-slate-300">|</span>
                        <span class="font-bold text-slate-700">¥</span>
                        <inline-input 
                          v-model="salaryStats.max" 
                          width="w-8" 
                          class-name="border-transparent text-slate-800" 
                        />
                        <span class="text-xs text-slate-400">k</span>
                      </div>
                    </div>
                    <div class="h-6 w-px bg-slate-200 mx-2"></div>
                    <div class="flex flex-col flex-1">
                      <span class="text-[10px] text-emerald-600 uppercase font-bold">Target Range (核心区间)</span>
                      <div class="flex items-center">
                        <inline-input 
                          v-model="salaryStats.modeLow" 
                          width="w-8" 
                          class-name="text-emerald-700 border-emerald-200 bg-emerald-50 rounded px-1" 
                        /> 
                        <span class="text-emerald-400 mx-1 font-bold">-</span>
                        <inline-input 
                          v-model="salaryStats.modeHigh" 
                          width="w-8" 
                          class-name="text-emerald-700 border-emerald-200 bg-emerald-50 rounded px-1" 
                        />
                        <span class="text-xs text-emerald-600 ml-1">k</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 专业文字分析区域 -->
                  <div class="mt-3">
                    <auto-resize-textarea 
                      v-model="salaryAnalysis"
                      class-name="text-xs text-slate-600 leading-relaxed border-l-2 border-emerald-400 pl-2"
                      placeholder="在此输入薪酬对标分析..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧专栏：项目策略 -->
          <div class="space-y-6 flex flex-col">
            
            <!-- 3. 推进漏斗 -->
            <div class="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div class="p-4 border-b border-slate-100 bg-slate-50/50">
                <section-header icon="target" title="Pipeline Status / 招聘进度" />
              </div>
              <div class="p-4 flex flex-col justify-center space-y-3">
                <div 
                  v-for="stage in funnelStages" 
                  :key="stage.key" 
                  class="flex items-center gap-3"
                >
                  <div class="w-24 text-[10px] text-slate-500 font-medium text-right leading-tight">
                    {{ stage.label }}
                  </div>
                  <div class="flex-1 h-8 bg-slate-100 rounded-sm overflow-hidden relative flex items-center">
                    <div 
                      :class="`absolute left-0 top-0 bottom-0 ${stage.color} opacity-20`" 
                      :style="{width: getFunnelPercent(stage.key) + '%'}"
                    ></div>
                    <div :class="`absolute left-0 top-0 bottom-0 w-1 ${stage.color}`"></div>
                    <inline-input 
                      v-model="funnel[stage.key]"
                      width="w-full"
                      class-name="text-left pl-3 text-slate-700 border-transparent text-sm z-10"
                      :suffix="stage.key === 'recommended' ? ' Candidates' : ''"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- 4. 专家建议 -->
            <div class="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div class="p-4 border-b border-slate-100 bg-slate-50/50">
                <section-header icon="lightbulb" title="Executive Summary / 综合建议" />
              </div>
              <div class="p-4 flex-1 flex flex-col gap-4">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                    <label class="text-[10px] font-bold text-slate-500 uppercase">Sourcing Strategy (策略)</label>
                  </div>
                  <auto-resize-textarea 
                    v-model="advice"
                    class-name="text-xs text-slate-700 leading-relaxed bg-amber-50/30 p-2 rounded border border-amber-100/50 min-h-[80px]"
                    placeholder="输入招聘策略..."
                  />
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                    <label class="text-[10px] font-bold text-slate-500 uppercase">Potential Risks (风险)</label>
                  </div>
                  <auto-resize-textarea 
                    v-model="risk"
                    class-name="text-xs text-slate-700 leading-relaxed bg-red-50/30 p-2 rounded border border-red-100/50 min-h-[60px]"
                    placeholder="输入潜在风险..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 5. 佐证材料区域 -->
        <div class="mt-6">
          <div class="flex items-center gap-2 mb-3 px-1">
            <image-icon :size="14" class="text-slate-400" />
            <h3 class="font-bold text-slate-500 text-xs uppercase tracking-wider">Appendix / 附件佐证</h3>
          </div>
          
          <div class="grid grid-cols-4 md:grid-cols-6 gap-3">
            <div 
              v-for="img in evidenceImages" 
              :key="img.id" 
              class="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-white"
            >
              <img :src="img.url" alt="Evidence" class="w-full h-full object-cover" />
              <button 
                @click="removeImage(img.id)"
                class="absolute top-1 right-1 bg-white/90 text-slate-500 hover:text-red-500 p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <x-icon :size="12" />
              </button>
            </div>

            <!-- 上传按钮 -->
            <div 
              @click="$refs.fileInput.click()"
              class="aspect-square rounded-lg border border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 gap-1 group bg-white"
            >
              <plus-icon :size="20" class="text-slate-300 group-hover:text-indigo-400" />
              <span class="text-[10px] font-medium">Add Image</span>
              <input 
                ref="fileInput"
                type="file" 
                @change="handleImageUpload" 
                accept="image/*" 
                multiple 
                class="hidden" 
              />
            </div>
          </div>
        </div>

      </div>

      <!-- 底部按钮 -->
      <div 
        data-html2canvas-ignore="true" 
        class="p-4 md:px-8 bg-white border-t border-slate-100 flex gap-3"
      >
        <button 
          @click="handleScreenshot"
          :disabled="isGenerating"
          :class="[
            'flex-1 text-white py-3 rounded-lg font-medium text-sm transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2',
            isGenerating ? 'bg-slate-400 cursor-wait' : 'bg-slate-800 hover:bg-slate-900'
          ]"
        >
          <loader-2-icon v-if="isGenerating" :size="16" class="animate-spin" />
          <download-icon v-else :size="16" />
          <span>{{ isGenerating ? 'Generating...' : 'Export Report (.png)' }}</span>
        </button>
      </div>

    </div>
  </div>
</template>

<script>
// 导入图标组件 (需要根据实际使用的图标库调整)
// 如果使用 lucide-vue 或类似库
import {
  Users as UsersIcon,
  DollarSign as DollarSignIcon,
  Lightbulb as LightbulbIcon,
  Target as TargetIcon,
  Briefcase as BriefcaseIcon,
  MapPin as MapPinIcon,
  Download as DownloadIcon,
  Loader2 as Loader2Icon,
  Image as ImageIcon,
  Plus as PlusIcon,
  X as XIcon,
  FileText as FileTextIcon,
  Edit3 as Edit3Icon
} from 'lucide-vue';

// 子组件定义
const InlineInput = {
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    width: {
      type: String,
      default: 'w-16'
    },
    suffix: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    }
  },
  template: `
    <div class="inline-flex items-center mx-1 relative group">
      <input
        :type="type"
        :value="value"
        @input="$emit('input', $event.target.value)"
        :class="'bg-transparent border-b-2 text-center font-bold focus:outline-none transition-colors px-1 ' + width + ' ' + className"
      />
      <span v-if="suffix" :class="'ml-1 text-sm opacity-80 ' + (className.includes('text-white') ? 'text-white' : 'text-slate-500')">
        {{ suffix }}
      </span>
      <span :class="'absolute -top-3 right-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ' + (className.includes('text-white') ? 'text-white' : 'text-indigo-300')">
        <edit3-icon :size="10" />
      </span>
    </div>
  `,
  components: { Edit3Icon }
};

const AutoResizeTextarea = {
  props: {
    value: {
      type: String,
      default: ''
    },
    className: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  template: `
    <textarea
      ref="textarea"
      :value="value"
      @input="handleInput"
      :class="'w-full bg-transparent border-none focus:ring-0 resize-none p-0 overflow-hidden ' + className"
      :placeholder="placeholder"
      rows="1"
    ></textarea>
  `,
  methods: {
    handleInput(e) {
      this.$emit('input', e.target.value);
      this.adjustHeight();
    },
    adjustHeight() {
      const textarea = this.$refs.textarea;
      if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
      }
    }
  },
  mounted() {
    this.adjustHeight();
  },
  watch: {
    value() {
      this.$nextTick(() => {
        this.adjustHeight();
      });
    }
  }
};

const SectionHeader = {
  props: {
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  template: `
    <div class="flex items-center gap-2 mb-3">
      <div class="p-1 bg-slate-100 rounded-lg text-slate-600">
        <component :is="iconComponent" :size="14" />
      </div>
      <h3 class="font-bold text-slate-700 text-xs uppercase tracking-wider">{{ title }}</h3>
    </div>
  `,
  computed: {
    iconComponent() {
      const iconMap = {
        'users': UsersIcon,
        'dollar-sign': DollarSignIcon,
        'lightbulb': LightbulbIcon,
        'target': TargetIcon
      };
      return iconMap[this.icon];
    }
  },
  components: {
    UsersIcon,
    DollarSignIcon,
    LightbulbIcon,
    TargetIcon
  }
};

// 简单的图表组件（需要根据实际使用的图表库调整）
const BarChart = {
  props: {
    chartData: {
      type: Array,
      required: true
    }
  },
  template: `
    <div class="w-full h-full flex items-end gap-1 px-2">
      <div 
        v-for="(item, index) in chartData" 
        :key="index"
        class="flex-1 rounded-t transition-all"
        :style="{
          height: (item.count / maxCount * 100) + '%',
          backgroundColor: item.fill
        }"
      ></div>
    </div>
  `,
  computed: {
    maxCount() {
      return Math.max(...this.chartData.map(d => d.count), 1);
    }
  }
};

const AreaChart = {
  props: {
    chartData: {
      type: Array,
      required: true
    }
  },
  template: `
    <div class="w-full h-full">
      <svg viewBox="0 0 100 50" class="w-full h-full">
        <path 
          :d="pathData" 
          fill="#10B981" 
          opacity="0.3"
        />
      </svg>
    </div>
  `,
  computed: {
    pathData() {
      const data = this.chartData;
      const width = 100;
      const height = 50;
      const step = width / (data.length - 1);
      const max = Math.max(...data.map(d => d.value));
      
      let path = `M 0 ${height}`;
      data.forEach((d, i) => {
        const x = i * step;
        const y = height - (d.value / max * height);
        path += ` L ${x} ${y}`;
      });
      path += ` L ${width} ${height} Z`;
      
      return path;
    }
  }
};

export default {
  name: 'TalentMappingReport',
  
  components: {
    InlineInput,
    AutoResizeTextarea,
    SectionHeader,
    BarChart,
    AreaChart,
    UsersIcon,
    DollarSignIcon,
    LightbulbIcon,
    TargetIcon,
    BriefcaseIcon,
    MapPinIcon,
    DownloadIcon,
    Loader2Icon,
    ImageIcon,
    PlusIcon,
    XIcon,
    FileTextIcon
  },

  data() {
    return {
      jobTitle: '授权体验店·店长',
      city: '重庆·万州',
      isGenerating: false,
      evidenceImages: [],
      
      // 1. 人才分布数据
      distData: [
        { name: '1-3年', count: 45, fill: '#93C5FD' },
        { name: '3-5年', count: 120, fill: '#3B82F6' },
        { name: '5-8年', count: 60, fill: '#2563EB' },
        { name: '8年+', count: 15, fill: '#1E40AF' },
      ],
      distAnalysis: "人才画像洞察：本地零售管理人才主要集中在通讯及3C数码行业。其中，具备全盘运营经验的资深人选（5年以上）较为稀缺，占比不足10%。人才池主要由一线销售晋升的初级店长构成，需重点甄别其'经营思维'与'团队梯队建设'能力。",
      
      // 2. 薪资数据
      salaryStats: {
        min: 6,
        modeLow: 8,
        modeHigh: 12,
        max: 18
      },
      salaryAnalysis: "薪酬对标分析：万州区域店长薪资中位数约在 8k-12k/月（含绩效）。头部品牌（如竞品核心店）资深店长年包可达 15w-20w。建议采用'底薪+高绩效杠杆'的薪酬结构，以保障在旺季对头部人才的吸引力。",
      
      // 3. 建议与风险
      advice: "1. **画像聚焦**：优先寻访有TOP品牌（如苏宁/国美/OV）连锁管理经验的店长，重点考察其过往'单店盈利'与'库存周转'的实战业绩。\n2. **渠道策略**：建议启动'定点挖猎'策略，针对万达/高笋塘商圈的竞品核心店长进行定向触达。",
      risk: "1. **人才断层**：本地具备千万级年销盘面管理经验的人才极度稀缺，可能需要放宽行业背景（如看高端服饰/汽车行业）。\n2. **稳定性风险**：部分优秀人选为外地派驻，需重点考察其长期留本地发展的意愿，防范回流风险。",
      
      // 4. 漏斗数据
      funnel: {
        recommended: 42,
        qualified: 15,
        revealed: 5,
        onboarded: 0
      },
      
      funnelStages: [
        { key: 'recommended', label: '人才寻访 (Sourcing)', color: 'bg-indigo-400' },
        { key: 'qualified', label: '初试/复试 (Interview)', color: 'bg-indigo-500' },
        { key: 'revealed', label: '谈薪/Offer (Negotiation)', color: 'bg-indigo-600' },
        { key: 'onboarded', label: '入职 (Onboard)', color: 'bg-green-500' },
      ]
    };
  },

  computed: {
    salaryChartData() {
      return [
        { name: 'Min', value: 10 },
        { name: 'Start', value: 20 },
        { name: 'Mode', value: 100 }, 
        { name: 'End', value: 20 },
        { name: 'Max', value: 5 }
      ];
    },
    
    maxFunnelVal() {
      return Math.max(this.funnel.recommended, 1);
    }
  },

  methods: {
    // 计算漏斗百分比
    getFunnelPercent(key) {
      return Math.max(25, (this.funnel[key] / this.maxFunnelVal) * 100);
    },

    // 图片上传处理
    handleImageUpload(e) {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      const newImages = files.map(file => ({
        id: Date.now() + Math.random(),
        url: URL.createObjectURL(file),
        file
      }));

      this.evidenceImages = [...this.evidenceImages, ...newImages];
      
      // 清空input
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },

    // 删除图片
    removeImage(id) {
      this.evidenceImages = this.evidenceImages.filter(img => img.id !== id);
    },

    // 截图功能
    async handleScreenshot() {
      if (!window.html2canvas) {
        alert("截图插件尚未加载完成，请稍后重试");
        return;
      }
      
      this.isGenerating = true;

      try {
        const canvas = await window.html2canvas(this.$refs.reportRef, {
          scale: 2, 
          backgroundColor: '#ffffff',
          useCORS: true 
        });

        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `人才洞察报告_${this.jobTitle}_${this.city}.png`;
        link.click();
      } catch (error) {
        console.error("截图生成失败:", error);
        alert("截图生成失败，请尝试刷新页面重试");
      } finally {
        this.isGenerating = false;
      }
    },

    // 加载html2canvas
    loadHtml2Canvas() {
      const script = document.createElement('script');
      script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
      script.async = true;
      document.body.appendChild(script);
    }
  },

  mounted() {
    this.loadHtml2Canvas();
  }
};
</script>

<style scoped>
/* 如果需要额外的样式，可以在这里添加 */
</style>
