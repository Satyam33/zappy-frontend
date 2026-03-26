import { ProgressBar } from '../../components/shared/ProgressBar'

interface DeliveryFunnel {
  sent: number
  delivered: number
  read: number
  replied: number
  failed: number
}

export const DeliveryChart = ({ funnel }: { funnel: DeliveryFunnel }) => (
  <div className="bg-white border border-gray-100 rounded-xl p-[18px_20px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
    <h3 className="font-[Syne,sans-serif] text-[14px] font-semibold text-gray-900 mb-4">
      Message Delivery Funnel
    </h3>
    <ProgressBar label="Sent"      value={funnel.sent}      max={funnel.sent} color="blue"  showCount />
    <ProgressBar label="Delivered" value={funnel.delivered} max={funnel.sent} color="green" showCount />
    <ProgressBar label="Read"      value={funnel.read}      max={funnel.sent} color="green" showCount />
    <ProgressBar label="Replied"   value={funnel.replied}   max={funnel.sent} color="accent" showCount />
    <ProgressBar label="Failed"    value={funnel.failed}    max={funnel.sent} color="red"   showCount />
  </div>
)
