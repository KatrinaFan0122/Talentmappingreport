import React, { useState, useRef, useEffect } from 'react';
import { 
  BarChart, Bar, Cell, ResponsiveContainer, 
  AreaChart, Area, XAxis 
} from 'recharts';
import { 
  Users, 
  DollarSign, 
  Lightbulb, 
  Target, 
  Briefcase, 
  Share2,
  Edit3,
  ArrowDown,
  MapPin,
  Download,
  Loader2,
  Image as ImageIcon,
  Plus,
  X,
  FileText
} from 'lucide-react';

// --- 组件部分 ---

// 下划线填空输入框组件
const InlineInput = ({ value, onChange, type = "text", width = "w-16", suffix = "", className = "", placeholderColor = "placeholder-indigo-300" }) => (
  <div className="inline-flex items-center mx-1 relative group">
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`bg-transparent border-b-2 text-center font-bold focus:outline-none transition-colors px-1 ${width} ${className}`}
    />
    {suffix && <span className={`ml-1 text-sm opacity-80 ${className.includes('text-white') ? 'text-white' : 'text-slate-500'}`}>{suffix}</span>}
    <span className={`absolute -top-3 right-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${className.includes('text-white') ? 'text-white' : 'text-indigo-300'}`}>
      <Edit3 size={10} />
    </span>
  </div>
);

// 自动高度的文本域组件，用于专业文字输入
const AutoResizeTextarea = ({ value, onChange, className = "", placeholder = "" }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full bg-transparent border-none focus:ring-0 resize-none p-0 overflow-hidden ${className}`}
      placeholder={placeholder}
      rows={1}
    />
  );
};

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-3">
    <div className="p-1 bg-slate-100 rounded-lg text-slate-600">
      <Icon size={14} />
    </div>
    <h3 className="font-bold text-slate-700 text-xs uppercase tracking-wider">{title}</h3>
  </div>
);

const App = () => {
  // --- 状态管理 ---
  // 更新为更专业的默认文案
  const [jobTitle, setJobTitle] = useState('授权体验店·店长');
  const [city, setCity] = useState('重庆·万州');
  const [isGenerating, setIsGenerating] = useState(false);
  const reportRef = useRef(null); 
  const fileInputRef = useRef(null); 
  
  // 佐证图片状态
  const [evidenceImages, setEvidenceImages] = useState([]);

  // 1. 人才分布数据 & 专业洞察
  const [distData, setDistData] = useState([
    { name: '1-3年', count: 45, fill: '#93C5FD' },
    { name: '3-5年', count: 120, fill: '#3B82F6' },
    { name: '5-8年', count: 60, fill: '#2563EB' },
    { name: '8年+', count: 15, fill: '#1E40AF' },
  ]);
  const [distAnalysis, setDistAnalysis] = useState("人才画像洞察：本地零售管理人才主要集中在通讯及3C数码行业。其中，具备全盘运营经验的资深人选（5年以上）较为稀缺，占比不足10%。人才池主要由一线销售晋升的初级店长构成，需重点甄别其'经营思维'与'团队梯队建设'能力。");

  const updateDistCount = (index, val) => {
    const newData = [...distData];
    newData[index].count = Number(val) || 0;
    setDistData(newData);
  };

  // 2. 薪资数据 & 专业分析
  const [salaryStats, setSalaryStats] = useState({
    min: 6,
    modeLow: 8,
    modeHigh: 12,
    max: 18
  });
  const [salaryAnalysis, setSalaryAnalysis] = useState("薪酬对标分析：万州区域店长薪资中位数约在 8k-12k/月（含绩效）。头部品牌（如竞品核心店）资深店长年包可达 15w-20w。建议采用'底薪+高绩效杠杆'的薪酬结构，以保障在旺季对头部人才的吸引力。");

  const getSalaryChartData = () => [
    { name: 'Min', value: 10 },
    { name: 'Start', value: 20 },
    { name: 'Mode', value: 100 }, 
    { name: 'End', value: 20 },
    { name: 'Max', value: 5 }
  ];

  // 3. 建议与难点 (更结构化的文案)
  const [advice, setAdvice] = useState("1. **画像聚焦**：优先寻访有TOP品牌（如苏宁/国美/OV）连锁管理经验的店长，重点考察其过往'单店盈利'与'库存周转'的实战业绩。\n2. **渠道策略**：建议启动'定点挖猎'策略，针对万达/高笋塘商圈的竞品核心店长进行定向触达。");
  const [risk, setRisk] = useState("1. **人才断层**：本地具备千万级年销盘面管理经验的人才极度稀缺，可能需要放宽行业背景（如看高端服饰/汽车行业）。\n2. **稳定性风险**：部分优秀人选为外地派驻，需重点考察其长期留本地发展的意愿，防范回流风险。");

  // 4. 漏斗数据
  const [funnel, setFunnel] = useState({
    recommended: 42,
    qualified: 15,
    revealed: 5,
    onboarded: 0
  });

  const funnelStages = [
    { key: 'recommended', label: '人才寻访 (Sourcing)', color: 'bg-indigo-400' },
    { key: 'qualified', label: '初试/复试 (Interview)', color: 'bg-indigo-500' },
    { key: 'revealed', label: '谈薪/Offer (Negotiation)', color: 'bg-indigo-600' },
    { key: 'onboarded', label: '入职 (Onboard)', color: 'bg-green-500' },
  ];

  const maxFunnelVal = Math.max(funnel.recommended, 1);

  // --- 动态加载 html2canvas ---
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // --- 图片上传处理 ---
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = files.map(file => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      file // 保留文件对象以防后续需要
    }));

    setEvidenceImages(prev => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (id) => {
    setEvidenceImages(prev => prev.filter(img => img.id !== id));
  };

  // --- 截图功能 ---
  const handleScreenshot = async () => {
    if (!window.html2canvas) {
      alert("截图插件尚未加载完成，请稍后重试");
      return;
    }
    
    setIsGenerating(true);

    try {
      const canvas = await window.html2canvas(reportRef.current, {
        scale: 2, 
        backgroundColor: '#ffffff',
        useCORS: true 
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `人才洞察报告_${jobTitle}_${city}.png`;
      link.click();
    } catch (error) {
      console.error("截图生成失败:", error);
      alert("截图生成失败，请尝试刷新页面重试");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 md:p-6 font-sans">
      
      {/* 卡片容器 */}
      <div 
        ref={reportRef} 
        className="bg-white w-full max-w-[420px] md:max-w-5xl rounded-[24px] shadow-xl overflow-hidden border border-slate-200 transition-all duration-300 flex flex-col"
      >
        
        {/* 顶部 Header - 专业深色风格 */}
        <div className="bg-slate-800 p-6 md:p-8 text-white relative overflow-hidden flex-shrink-0">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Briefcase size={120} className="transform md:scale-125 origin-top-right" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="bg-indigo-500 w-1 h-4 rounded-full"></div>
                <div className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Talent Mapping Report</div>
              </div>
              
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight flex items-baseline whitespace-nowrap">
                  岗位：
                  <input 
                    value={jobTitle} 
                    onChange={e => setJobTitle(e.target.value)}
                    className="bg-transparent border-b border-slate-500 text-white w-full md:w-auto md:min-w-[280px] focus:outline-none focus:border-white transition-colors placeholder-slate-500 text-ellipsis pb-1"
                  />
                </h1>
                
                <div className="flex items-center text-slate-300">
                   <MapPin size={16} className="mr-1 text-slate-400 flex-shrink-0" />
                   <span className="text-xs font-medium mr-1 whitespace-nowrap">City:</span>
                   <input 
                     value={city} 
                     onChange={e => setCity(e.target.value)}
                     className="bg-transparent border-b border-slate-500 text-white w-20 focus:outline-none focus:border-white transition-colors placeholder-slate-500 text-xs font-bold pb-1"
                   />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-300 bg-slate-700/50 inline-flex px-3 py-1.5 rounded-sm backdrop-blur-sm whitespace-nowrap self-start md:self-auto border border-slate-600">
              <FileText size={10} />
              <span>CONFIDENTIAL</span>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-5 md:p-8 flex-1 flex flex-col bg-slate-50/30">
          {/* 上半部分 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            
            {/* 左侧专栏：市场情报 */}
            <div className="space-y-6 flex flex-col">
              
              {/* 1. 人才分布 (增强版：带洞察文本) */}
              <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <SectionHeader icon={Users} title="Market Distribution / 人才分布" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  {/* 图表区域 */}
                  <div className="flex items-end gap-2 h-20 mb-4">
                     <div className="flex-1 h-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={distData}>
                            <Bar dataKey="count" radius={[3, 3, 3, 3]}>
                              {distData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                     </div>
                     {/* 简易图例 */}
                     <div className="text-[10px] text-slate-400 flex flex-col justify-between h-full py-1">
                        {distData.map(d => <div key={d.name}>{d.name}</div>)}
                     </div>
                  </div>

                  {/* 核心数据填空 */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                     {distData.map((item, index) => (
                       <div key={item.name} className="text-center bg-slate-50 rounded p-1">
                          <div className="text-[10px] text-slate-400">{item.name}</div>
                          <InlineInput 
                            value={item.count} 
                            onChange={(val) => updateDistCount(index, val)} 
                            width="w-full"
                            className="text-indigo-600 text-sm border-transparent"
                          />
                       </div>
                     ))}
                  </div>

                  {/* 专业文字分析区域 */}
                  <div className="bg-blue-50/50 rounded-lg p-3 border border-blue-100 mt-auto">
                    <AutoResizeTextarea 
                      value={distAnalysis}
                      onChange={setDistAnalysis}
                      className="text-xs text-slate-700 leading-relaxed text-justify"
                      placeholder="在此输入专业的人才画像分析..."
                    />
                  </div>
                </div>
              </div>

              {/* 2. 薪资填空 (增强版：带分析) */}
              <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <SectionHeader icon={DollarSign} title="Compensation / 薪酬分析 (K/月)" />
                </div>
                <div className="p-4 flex-1 flex flex-col relative">
                   {/* 背景装饰 */}
                   <div className="absolute top-16 right-4 w-24 h-12 opacity-10 pointer-events-none">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={getSalaryChartData()}>
                          <Area type="monotone" dataKey="value" stroke="#10B981" fill="#10B981" strokeWidth={0} />
                        </AreaChart>
                      </ResponsiveContainer>
                   </div>

                   <div className="text-sm text-slate-700 leading-snug space-y-4">
                     <div className="flex items-center justify-between text-xs md:text-sm bg-slate-50 p-2 rounded-lg border border-slate-100">
                       <div className="flex flex-col">
                         <span className="text-[10px] text-slate-400 uppercase">Min - Max</span>
                         <div>
                            <span className="font-bold text-slate-700">¥</span>
                            <InlineInput value={salaryStats.min} onChange={v => setSalaryStats({...salaryStats, min: v})} width="w-8" className="border-transparent text-slate-800" />
                            <span className="mx-1 text-slate-300">|</span>
                            <span className="font-bold text-slate-700">¥</span>
                            <InlineInput value={salaryStats.max} onChange={v => setSalaryStats({...salaryStats, max: v})} width="w-8" className="border-transparent text-slate-800" />
                            <span className="text-xs text-slate-400">k</span>
                         </div>
                       </div>
                       <div className="h-6 w-px bg-slate-200 mx-2"></div>
                       <div className="flex flex-col flex-1">
                          <span className="text-[10px] text-emerald-600 uppercase font-bold">Target Range (核心区间)</span>
                          <div className="flex items-center">
                            <InlineInput value={salaryStats.modeLow} onChange={v => setSalaryStats({...salaryStats, modeLow: v})} width="w-8" className="text-emerald-700 border-emerald-200 bg-emerald-50 rounded px-1" /> 
                            <span className="text-emerald-400 mx-1 font-bold">-</span>
                            <InlineInput value={salaryStats.modeHigh} onChange={v => setSalaryStats({...salaryStats, modeHigh: v})} width="w-8" className="text-emerald-700 border-emerald-200 bg-emerald-50 rounded px-1" />
                            <span className="text-xs text-emerald-600 ml-1">k</span>
                          </div>
                       </div>
                     </div>
                     
                     {/* 专业文字分析区域 */}
                     <div className="mt-3">
                        <AutoResizeTextarea 
                          value={salaryAnalysis}
                          onChange={setSalaryAnalysis}
                          className="text-xs text-slate-600 leading-relaxed border-l-2 border-emerald-400 pl-2"
                          placeholder="在此输入薪酬对标分析..."
                        />
                     </div>
                   </div>
                </div>
              </div>
            </div>

            {/* 右侧专栏：项目策略 */}
            <div className="space-y-6 flex flex-col">
              
              {/* 3. 推进漏斗 (列表式，更清晰) */}
              <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                   <SectionHeader icon={Target} title="Pipeline Status / 招聘进度" />
                </div>
                <div className="p-4 flex flex-col justify-center space-y-3">
                   {funnelStages.map((stage, index) => {
                     const percent = Math.max(25, (funnel[stage.key] / maxFunnelVal) * 100);
                     return (
                       <div key={stage.key} className="flex items-center gap-3">
                         <div className="w-24 text-[10px] text-slate-500 font-medium text-right leading-tight">{stage.label}</div>
                         <div className="flex-1 h-8 bg-slate-100 rounded-sm overflow-hidden relative flex items-center">
                            <div className={`absolute left-0 top-0 bottom-0 ${stage.color} opacity-20`} style={{width: `${percent}%`}}></div>
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${stage.color}`}></div>
                            <InlineInput 
                                value={funnel[stage.key]} 
                                onChange={(v) => setFunnel({...funnel, [stage.key]: Number(v)})} 
                                width="w-full"
                                className="text-left pl-3 text-slate-700 border-transparent text-sm z-10"
                                suffix={stage.key === 'recommended' ? ' Candidates' : ''}
                            />
                         </div>
                       </div>
                     );
                   })}
                </div>
              </div>

              {/* 4. 专家建议 (更像文档的排版) */}
              <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <SectionHeader icon={Lightbulb} title="Executive Summary / 综合建议" />
                </div>
                <div className="p-4 flex-1 flex flex-col gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                       <label className="text-[10px] font-bold text-slate-500 uppercase">Sourcing Strategy (策略)</label>
                    </div>
                    <AutoResizeTextarea 
                      value={advice}
                      onChange={setAdvice}
                      className="text-xs text-slate-700 leading-relaxed bg-amber-50/30 p-2 rounded border border-amber-100/50 min-h-[80px]"
                      placeholder="输入招聘策略..."
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                       <span className="w-1.5 h-1.5 bg-red-400 rounded-full"></span>
                       <label className="text-[10px] font-bold text-slate-500 uppercase">Potential Risks (风险)</label>
                    </div>
                    <AutoResizeTextarea 
                      value={risk}
                      onChange={setRisk}
                      className="text-xs text-slate-700 leading-relaxed bg-red-50/30 p-2 rounded border border-red-100/50 min-h-[60px]"
                      placeholder="输入潜在风险..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 5. 佐证材料区域 */}
          <div className="mt-6">
             <div className="flex items-center gap-2 mb-3 px-1">
                <ImageIcon size={14} className="text-slate-400" />
                <h3 className="font-bold text-slate-500 text-xs uppercase tracking-wider">Appendix / 附件佐证</h3>
             </div>
             
             <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
               {evidenceImages.map((img) => (
                 <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-200 bg-white">
                    <img src={img.url} alt="Evidence" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1 right-1 bg-white/90 text-slate-500 hover:text-red-500 p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                 </div>
               ))}

               {/* 上传按钮 */}
               <div 
                 onClick={() => fileInputRef.current?.click()}
                 className="aspect-square rounded-lg border border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer flex flex-col items-center justify-center text-slate-400 hover:text-indigo-500 gap-1 group bg-white"
               >
                 <Plus size={20} className="text-slate-300 group-hover:text-indigo-400" />
                 <span className="text-[10px] font-medium">Add Image</span>
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleImageUpload} 
                   accept="image/*" 
                   multiple 
                   className="hidden" 
                 />
               </div>
             </div>
          </div>

        </div>

        {/* 底部按钮 */}
        <div 
            data-html2canvas-ignore="true" 
            className="p-4 md:px-8 bg-white border-t border-slate-100 flex gap-3"
        >
          <button 
            onClick={handleScreenshot}
            disabled={isGenerating}
            className={`flex-1 ${isGenerating ? 'bg-slate-400 cursor-wait' : 'bg-slate-800 hover:bg-slate-900'} text-white py-3 rounded-lg font-medium text-sm transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2`}
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download size={16} />
                Export Report (.png)
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default App;
