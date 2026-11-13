import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { WorkspaceRecordItem } from '../../types/mandelaOS';

export interface ColumnDef<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  width?: string;
  sortable?: boolean;
}

export interface HighDensityTableProps {
  records: WorkspaceRecordItem[];
  columns?: ColumnDef<WorkspaceRecordItem>[];
  onSelectRecord?: (record: WorkspaceRecordItem) => void;
  selectedRecordId?: string;
  searchPlaceholder?: string;
  pageSize?: number;
}

export const HighDensityTable: React.FC<HighDensityTableProps> = ({
  records,
  columns,
  onSelectRecord,
  selectedRecordId,
  searchPlaceholder = 'Search records by keyword, prefix, or ID...',
  pageSize = 10
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('title');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Default columns if not provided
  const activeColumns: ColumnDef<WorkspaceRecordItem>[] = useMemo(() => {
    if (columns && columns.length > 0) return columns;

    return [
      {
        key: 'title',
        header: 'Record Identifier',
        sortable: true,
        render: (item) => (
          <div>
            <div className="font-bold text-neutral-900 font-mono text-xs">{item.title}</div>
            {item.subtitle && (
              <div className="text-[11px] text-neutral-600 truncate">{item.subtitle}</div>
            )}
          </div>
        )
      },
      {
        key: 'category',
        header: 'Category / Scope',
        render: (item) => (
          <span className="text-[11px] font-mono text-neutral-600">
            {item.category || 'General'}
          </span>
        )
      },
      {
        key: 'status',
        header: 'Status',
        sortable: true,
        render: (item) => {
          const isOk = item.status === 'ACTIVE';
          const isWarn = item.status === 'WARNING';
          return (
            <div className="flex items-center gap-1.5 text-[11px] font-mono">
              <span
                className={`w-2 h-2 rounded-full ${
                  isOk ? 'bg-emerald-500' : isWarn ? 'bg-amber-500' : 'bg-neutral-400'
                }`}
              />
              <span
                className={`font-semibold ${
                  isOk ? 'text-emerald-700' : isWarn ? 'text-amber-700' : 'text-neutral-600'
                }`}
              >
                {item.status}
              </span>
            </div>
          );
        }
      },
      {
        key: 'provenance',
        header: 'Source / Provenance',
        render: (item) => (
          <span className="text-[11px] font-mono text-neutral-600 truncate max-w-[180px] block" title={item.provenance}>
            {item.provenance}
          </span>
        )
      },
      {
        key: 'lastUpdated',
        header: 'Last Synchronized',
        align: 'right',
        render: (item) => (
          <span className="text-[11px] font-mono text-neutral-600 tabular-nums">
            {item.lastUpdated}
          </span>
        )
      }
    ];
  }, [columns]);

  // Filter & Search
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.subtitle?.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.provenance.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [records, statusFilter, searchQuery]);

  // Sort
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      const valA = (a as any)[sortField] || '';
      const valB = (b as any)[sortField] || '';
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredRecords, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sortedRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedRecords.slice(start, start + pageSize);
  }, [sortedRecords, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortField === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(key);
      setSortAsc(true);
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-lg shadow-xs overflow-hidden flex flex-col font-sans">
      {/* Table Filter & Search Toolbar */}
      <div className="p-3 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50/70">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full bg-white border border-neutral-200 rounded-md pl-9 pr-3 py-1.5 text-xs text-neutral-900 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-white p-0.5 rounded-md border border-neutral-200 text-[11px] font-mono">
            {['ALL', 'ACTIVE', 'WARNING'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-neutral-900 text-white font-bold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-mono text-neutral-600 hidden sm:inline pl-1">
            {sortedRecords.length} records
          </span>
        </div>
      </div>

      {/* High-Density Data Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead className="bg-neutral-50 text-neutral-600 text-[10px] font-mono uppercase tracking-wider border-b border-neutral-200">
            <tr>
              {activeColumns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={{ width: col.width }}
                  className={`p-3 font-semibold ${
                    col.align === 'right'
                      ? 'text-right'
                      : col.align === 'center'
                      ? 'text-center'
                      : 'text-left'
                  } ${col.sortable ? 'cursor-pointer hover:text-neutral-900' : ''}`}
                >
                  <div className={`flex items-center gap-1 ${col.align === 'right' ? 'justify-end' : ''}`}>
                    <span>{col.header}</span>
                    {col.sortable && <ArrowUpDown className="w-3 h-3 text-neutral-400" />}
                  </div>
                </th>
              ))}
              <th className="p-3 w-10 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-neutral-200">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((record) => {
                const isSelected = selectedRecordId === record.id;
                return (
                  <tr
                    key={record.id}
                    onClick={() => onSelectRecord && onSelectRecord(record)}
                    className={`transition-colors cursor-pointer hover:bg-amber-50/40 ${
                      isSelected ? 'bg-amber-50/80 font-medium' : ''
                    }`}
                  >
                    {activeColumns.map((col) => (
                      <td
                        key={col.key}
                        className={`p-3 ${
                          col.align === 'right'
                            ? 'text-right'
                            : col.align === 'center'
                            ? 'text-center'
                            : 'text-left'
                        }`}
                      >
                        {col.render ? col.render(record) : (record as any)[col.key] || '—'}
                      </td>
                    ))}

                    <td className="p-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onSelectRecord) onSelectRecord(record);
                        }}
                        className="p-1 rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-900 transition-colors"
                        title="Inspect Record"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={activeColumns.length + 1} className="p-8 text-center text-neutral-600 font-mono text-xs">
                  No records match the current filter or search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Bar */}
      <div className="p-3 border-t border-neutral-200 flex items-center justify-between text-xs font-mono text-neutral-600 bg-neutral-50/50">
        <div>
          Showing {paginatedRecords.length} of {sortedRecords.length} items
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded hover:bg-neutral-200 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-bold text-neutral-900">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded hover:bg-neutral-200 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
