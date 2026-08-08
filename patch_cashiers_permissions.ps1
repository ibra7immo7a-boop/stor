$path = 'src/app/cashiers/page.tsx'
$text = Get-Content -Raw -Path $path

$oldInterface = @'
interface Permissions {
  directPOS: boolean;
  registerShifts: boolean;
  liveOrders: boolean;
  menuManagement: boolean;
  advancedReports: boolean;
  driverDelivery: boolean;
  printerSettings: boolean;
  staffManagement: boolean;
}
'@
$newInterface = @'
interface Permissions {
  directPOS: boolean;
  registerShifts: boolean;
  liveOrders: boolean;
  menuManagement: boolean;
  advancedReports: boolean;
  driverDelivery: boolean;
  printerSettings: boolean;
  messages: boolean;
  staffManagement: boolean;
}
'@
$text = $text.Replace($oldInterface, $newInterface)

$oldBadgeBlock = @'
                      {/* Permissions List */}
                      <TableCell>
                        <div class="flex flex-wrap gap-1">
                          {member.permissions.liveOrders && (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 text-[9px] rounded-md font-semibold">
                              الطلبات
                            </Badge>
                          )}
                          {member.permissions.menuManagement && (
                            <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/15 text-[9px] rounded-md font-semibold">
                              المنيو
                            </Badge>
                          )}
                          {member.permissions.advancedReports && (
                            <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/15 text-[9px] rounded-md font-semibold">
                              التقارير
                            </Badge>
                          )}
                          {member.permissions.messages && (
                            <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/15 text-[9px] rounded-md font-semibold">
                              الرسائل
                            </Badge>
                          )}
                          {member.permissions.staffManagement && (
                            <Badge className="bg-red-500/10 text-red-400 border border-red-500/15 text-[9px] rounded-md font-semibold">
                              الموظفين
                            </Badge>
                          )}
                        </div>
                      </TableCell>
'@
$newBadgeBlock = @'
                      {/* Permissions List */}
                      <TableCell>
                        <div class="flex flex-wrap gap-1">
                          {member.permissions.directPOS && (
                            <Badge className="bg-orange-500/10 text-orange-400 border border-orange-500/15 text-[9px] rounded-md font-semibold">
                              الكاشير
                            </Badge>
                          )}
                          {member.permissions.registerShifts && (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 text-[9px] rounded-md font-semibold">
                              ورديات
                            </Badge>
                          )}
                          {member.permissions.liveOrders && (
                            <Badge className="bg-sky-500/10 text-sky-400 border border-sky-500/15 text-[9px] rounded-md font-semibold">
                              الطلبات
                            </Badge>
                          )}
                          {member.permissions.menuManagement && (
                            <Badge className="bg-blue-500/10 text-blue-400 border border-blue-500/15 text-[9px] rounded-md font-semibold">
                              المنيو
                            </Badge>
                          )}
                          {member.permissions.advancedReports && (
                            <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/15 text-[9px] rounded-md font-semibold">
                              التقارير
                            </Badge>
                          )}
                          {member.permissions.driverDelivery && (
                            <Badge className="bg-violet-500/10 text-violet-400 border border-violet-500/15 text-[9px] rounded-md font-semibold">
                              التوصيل
                            </Badge>
                          )}
                          {member.permissions.printerSettings && (
                            <Badge className="bg-slate-500/10 text-slate-300 border border-slate-500/15 text-[9px] rounded-md font-semibold">
                              الطباعة
                            </Badge>
                          )}
                          {member.permissions.messages && (
                            <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/15 text-[9px] rounded-md font-semibold">
                              الرسائل
                            </Badge>
                          )}
                          {member.permissions.staffManagement && (
                            <Badge className="bg-red-500/10 text-red-400 border border-red-500/15 text-[9px] rounded-md font-semibold">
                              الموظفين
                            </Badge>
                          )}
                        </div>
                      </TableCell>
'@
$text = $text.Replace($oldBadgeBlock, $newBadgeBlock)

$oldSwitchList = @'
              [
                { key: "liveOrders", label: "الطلبات الحية", desc: "استعراض ومتابعة الطلبات المفتوحة فوراً" },
                { key: "menuManagement", label: "إدارة المنيو", desc: "تعديل وإضافة الوجبات والأسعار والأقسام" },
                { key: "advancedReports", label: "التقارير المتقدمة", desc: "مشاهدة وتحليل المبيعات والإيرادات اليومية" },
                { key: "messages", label: "سجل الرسائل", desc: "محادثة العملاء وتصفح سجل الدعم الفني" },
                { key: "staffManagement", label: "إدارة الموظفين والصلاحيات", desc: "إضافة وتعديل صلاحيات زملائه الموظفين" },
              ].map(perm => (
'@
$newSwitchList = @'
              [
                { key: "directPOS", label: "واجهة الكاشير", desc: "الوصول المباشر إلى شاشة نقطة البيع" },
                { key: "registerShifts", label: "إدارة الورديات", desc: "فتح وإغلاق ورديات العمل وتسجيل ساعات الموظفين" },
                { key: "liveOrders", label: "الطلبات الحية", desc: "استعراض ومتابعة الطلبات المفتوحة فوراً" },
                { key: "menuManagement", label: "إدارة المنيو", desc: "تعديل وإضافة الوجبات والأسعار والأقسام" },
                { key: "advancedReports", label: "التقارير المتقدمة", desc: "مشاهدة وتحليل المبيعات والإيرادات اليومية" },
                { key: "driverDelivery", label: "إدارة التوصيل", desc: "متابعة طلبات التوصيل وسجلات السائقين" },
                { key: "printerSettings", label: "إعدادات الطباعة", desc: "إدارة الطابعات والفواتير والتقارير المطبوعه" },
                { key: "messages", label: "سجل الرسائل", desc: "محادثة العملاء وتصفح سجل الدعم الفني" },
                { key: "staffManagement", label: "إدارة الموظفين والصلاحيات", desc: "إضافة وتعديل صلاحيات زملائه الموظفين" },
              ].map(perm => (
'@
$text = $text.Replace($oldSwitchList, $newSwitchList)

Set-Content -Path $path -Value $text -Encoding utf8
Write-Host 'patch complete'
