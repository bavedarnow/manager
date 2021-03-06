import * as React from 'react';

import TableRowEmpty from 'src/components/TableRowEmptyState';
import TableRowError from 'src/components/TableRowError';
import TableRowLoading from 'src/components/TableRowLoading';
import MonitorRow from './MonitorRow';

interface Props {
  monitors: Linode.ManagedServiceMonitor[];
  loading: boolean;
  openDialog: (id: number, label: string) => void;
  openDrawer: (id: number, mode: string) => void;
  error?: Linode.ApiFieldError[];
}

export type CombinedProps = Props;

export const MonitorTableContent: React.FC<CombinedProps> = props => {
  const { error, loading, monitors, openDialog, openDrawer } = props;
  if (loading) {
    return <TableRowLoading colSpan={12} />;
  }

  if (error) {
    return <TableRowError colSpan={12} message={error[0].reason} />;
  }

  if (monitors.length === 0) {
    return (
      <TableRowEmpty
        colSpan={12}
        message={"You don't have any Monitors on your account."}
      />
    );
  }

  return (
    <>
      {monitors.map((monitor: Linode.ManagedServiceMonitor, idx: number) => (
        <MonitorRow
          key={`service-monitor-row-${idx}`}
          monitor={monitor}
          openDialog={openDialog}
          openDrawer={openDrawer}
        />
      ))}
    </>
  );
};

export default MonitorTableContent;
