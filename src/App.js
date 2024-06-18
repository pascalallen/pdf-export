import React, { useState, useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { exportToPDF } from './gridExporter';
import 'ag-grid-enterprise';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import './App.css';

function App() {
  const [gridApi, setGridApi] = useState(null);
  const [rowData, setRowData] = useState([]);

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);

    fetch('https://www.ag-grid.com/example-assets/small-olympic-winners.json')
        .then((resp) => resp.json())
        .then((data) => setRowData(data));
  }, []);

  const columnDefs = useMemo(() => {
    return [
      { field: 'athlete' },
      {
        field: 'country',
        filter: 'agSetColumnFilter',
        cellStyle: {
          background: 'lightseagreen',
          bold: true,
          color: 'white',
          alignment: 'center',
        },
      },
      { field: 'age', filter: 'agNumberColumnFilter' },
      { field: 'sport', filter: 'agMultiColumnFilter' },
      { field: 'date', filter: 'agSetColumnFilter' },
      { field: 'bronze', filter: 'agNumberColumnFilter' },
      { field: 'silver', filter: 'agNumberColumnFilter' },
      { field: 'gold', filter: 'agNumberColumnFilter' },
    ];
  });

  const sideBar = useMemo(() => {
    return {
      toolPanels: [
        {
          id: 'columns',
          labelDefault: 'Columns',
          labelKey: 'columns',
          iconKey: 'columns',
          toolPanel: 'agColumnsToolPanel',
          minWidth: 225,
          maxWidth: 225,
          width: 225,
        },
        {
          id: 'filters',
          labelDefault: 'Filters',
          labelKey: 'filters',
          iconKey: 'filter',
          toolPanel: 'agFiltersToolPanel',
          minWidth: 180,
          maxWidth: 400,
          width: 250,
        },
      ],
      defaultToolPanel: [],
    };
  }, []);

  return (
      <div>
        <button onClick={() => exportToPDF(gridApi)}>Export to PDF</button>
        <div className="grid-container">
          <div className="ag-theme-quartz" style={{ height: '100%' }}>
            <AgGridReact
                columnDefs={columnDefs}
                sideBar={sideBar}
                rowData={rowData}
                defaultColDef={{
                  minWidth: 60,
                  filter: 'agTextColumnFilter',
                  menuTabs: ['filterMenuTab'],
                  enableRowGroup: true,
                  enablePivot: true,
                  enableValue: true,
                }}
                onGridReady={onGridReady}
                autoSizeStrategy={{
                  type: 'fitCellContents',
                }}
            />
          </div>
        </div>
      </div>
  );
}

export default App;
