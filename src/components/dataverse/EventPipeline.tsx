import React, { useState } from 'react';
import { DataverseEventSubscription } from '../../types/dataverse';
import {
  Zap,
  Plus,
  Trash2,
  CheckCircle2,
  RefreshCw,
  Server,
  ArrowRight,
  Globe,
  Radio,
  FileCode,
  ShieldCheck
} from 'lucide-react';

interface EventPipelineProps {
  subscriptions: DataverseEventSubscription[];
  onAddSubscription: (sub: Omit<DataverseEventSubscription, 'id' | 'dispatchedCount' | 'failureCount'>) => void;
  onToggleSubscription: (id: string) => void;
}

export const EventPipeline: React.FC<EventPipelineProps> = ({
  subscriptions,
  onAddSubscription,
  onToggleSubscription
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [targetEntity, setTargetEntity] = useState('*');
  const [eventType, setEventType] = useState<DataverseEventSubscription['eventType']>('all');
  const [destinationType, setDestinationType] = useState<DataverseEventSubscription['destinationType']>('kafka_topic');
  const [destinationEndpoint, setDestinationEndpoint] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !destinationEndpoint.trim()) return;

    onAddSubscription({
      name: name.trim(),
      targetEntity,
      eventType,
      destinationType,
      destinationEndpoint: destinationEndpoint.trim(),
      status: 'active',
      retryPolicy: 'exponential_backoff'
    });

    setName('');
    setDestinationEndpoint('');
    setShowAddModal(false);
  };

  const sampleRecentEvents = [
    {
      id: 'evt-01',
      topic: 'dataverse.cdc.fs_account.updated',
      timestamp: '2 mins ago',
      entity: 'fs_account',
      recordId: 'rec-acc-01',
      event: 'UPDATE',
      payload: { credit_limit_usd: 500000, active_sip_trunks_count: 6 }
    },
    {
      id: 'evt-02',
      topic: 'dataverse.cdc.fs_case.created',
      timestamp: '18 mins ago',
      entity: 'fs_case',
      recordId: 'rec-case-01',
      event: 'CREATE',
      payload: { ticket_number: 'CAS-2026-0941', priority: 'High P2 (Degraded)' }
    },
    {
      id: 'evt-03',
      topic: 'dataverse.cdc.fs_telecom_asset.status_changed',
      timestamp: '1 hour ago',
      entity: 'fs_telecom_asset',
      recordId: 'rec-ast-88',
      event: 'UPDATE',
      payload: { status: 'Active In Service', provisioned_pop: 'LOS' }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">Event Registration Pipeline & Change Data Capture</h2>
            <span className="text-xs text-purple-400 font-mono font-medium">· Apache Kafka &amp; Webhooks</span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Real-time change tracking across all Farsight applications. Publish entity mutations to Kafka event buses, external enterprise systems, and automation workflows.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="py-1.5 px-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register Event Hook</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Active Event Subscriptions (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono">
            <span className="font-bold text-white uppercase tracking-wider">
              Registered Event Listeners ({subscriptions.length})
            </span>
            <span className="text-emerald-400">Zero Data Loss · In-Order CDC</span>
          </div>

          <div className="space-y-3">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between font-mono">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      sub.destinationType === 'kafka_topic'
                        ? 'bg-purple-950 text-purple-300 border border-purple-500/40'
                        : sub.destinationType === 'webhook'
                        ? 'bg-blue-950 text-blue-300 border border-blue-500/40'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {sub.destinationType.replace('_', ' ')}
                    </span>
                    <strong className="text-white text-xs">{sub.name}</strong>
                  </div>

                  <button
                    onClick={() => onToggleSubscription(sub.id)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      sub.status === 'active'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {sub.status}
                  </button>
                </div>

                <div className="text-[11px] font-mono text-emerald-400/90 truncate">
                  Target: {sub.destinationEndpoint}
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 font-mono text-[10px] text-slate-400">
                  <div>
                    <span className="text-slate-500 block">Scope:</span>
                    <span className="text-white">{sub.targetEntity} ({sub.eventType})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Dispatched:</span>
                    <span className="text-amber-300">{sub.dispatchedCount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Failures:</span>
                    <span className="text-emerald-400">{sub.failureCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Event Stream Feed (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-mono">
            <span className="font-bold text-white uppercase tracking-wider">
              Real-Time CDC Event Stream
            </span>
            <span className="text-purple-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              Streaming
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {sampleRecentEvents.map((evt) => (
              <div key={evt.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-purple-300 font-bold">{evt.event}</span>
                  <span className="text-slate-500 text-[10px]">{evt.timestamp}</span>
                </div>
                <div className="text-white text-[11px] truncate">
                  Entity: <strong className="text-emerald-400">{evt.entity}</strong> ({evt.recordId})
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  Topic: {evt.topic}
                </div>
                <pre className="bg-slate-900 p-2 rounded text-[10px] text-slate-300 overflow-x-auto">
                  {JSON.stringify(evt.payload, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Add Subscription */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Register Dataverse Event Hook</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Listener Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Real-Time Account Sync Webhook"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-sans focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Target Entity</label>
                <select
                  value={targetEntity}
                  onChange={(e) => setTargetEntity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-purple-400"
                >
                  <option value="*">All Entities (*)</option>
                  <option value="fs_account">fs_account (Customers)</option>
                  <option value="fs_opportunity">fs_opportunity (Sales)</option>
                  <option value="fs_case">fs_case (Support Tickets)</option>
                  <option value="fs_telecom_asset">fs_telecom_asset (DIDs/Trunks)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Event Action</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-purple-400"
                  >
                    <option value="all">All (Create/Update/Delete)</option>
                    <option value="create">Create Only</option>
                    <option value="update">Update Only</option>
                    <option value="delete">Delete Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Destination Protocol</label>
                  <select
                    value={destinationType}
                    onChange={(e) => setDestinationType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-purple-400"
                  >
                    <option value="kafka_topic">Apache Kafka Topic</option>
                    <option value="webhook">REST HTTPS Webhook</option>
                    <option value="internal_workflow">Internal Workflow Task</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Destination URI / Topic Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. kafka://broker:9092/cdc.events or https://..."
                  value={destinationEndpoint}
                  onChange={(e) => setDestinationEndpoint(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  Register Listener
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
