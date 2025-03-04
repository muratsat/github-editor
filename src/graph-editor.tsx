import { useState } from "react";

const ContributionGridEditor = ({ year = new Date().getFullYear() }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [dateLabel, setDateLabel] = useState("");
  const [resultJson, setResultJson] = useState("");
  const [grid, setGrid] = useState<boolean[][]>(
    new Array(7).fill(new Array(53).fill(false))
  );

  const setCell = (row: number, col: number, value: boolean) => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((rowArr) => [...rowArr]); // Deep copy
      newGrid[row][col] = value;
      return newGrid;
    });
  };

  const firstDayOfYear = new Date(`${year}-01-01`);
  const firstDayWeekday = firstDayOfYear.getDay();
  const firstRow = firstDayWeekday;
  const firstCol = 0;

  const getDate = (row: number, col: number) => {
    const date = new Date(firstDayOfYear);
    const daysDiff = row + col * 7 - (firstRow + firstCol * 7);
    date.setDate(date.getDate() + daysDiff);
    return date;
  };

  // Handle cell toggle
  const toggleCell = (row: number, col: number) => {
    setCell(row, col, !grid[row][col]);
  };

  // Handle mouse events for drawing
  const handleMouseDown = (row: number, col: number) => {
    setIsDrawing(true);
    toggleCell(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    setDateLabel(
      getDate(row, col).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    );

    if (isDrawing) {
      toggleCell(row, col);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const exportJson = () => {
    // download json object of type { [key: string]: boolean }
    // where key is date in yyyy-mm-dd format
    const gridJson: { [key: string]: boolean } = {};
    grid.forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        const date = getDate(rowIdx, colIdx);
        const dateStr = date.toISOString().split("T")[0];
        gridJson[dateStr] = cell;
      });
    });

    const gridJsonStr = JSON.stringify(gridJson);
    setResultJson(gridJsonStr);
  };

  // Days of the week
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="p-4 bg-gray-50 w-full flex flex-col gap-3">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-bold">{year} Contribution Grid</h2>
      </div>

      <div className="flex ">
        {/* Day labels */}
        <div className="flex flex-col gap-1 h-full">
          {daysOfWeek.map((day, index) => (
            <div
              key={index}
              className="h-4 text-xs text-right pr-2 text-gray-500"
              style={{ height: "14px", lineHeight: "14px" }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex flex-col gap-1 h-full">
          {grid.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-1">
              {row.map((colored, colIdx) => (
                <div
                  key={colIdx}
                  className={`w-[14px] h-[14px] ${
                    colored ? "bg-green-500" : "bg-gray-200"
                  }`}
                  onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                  onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                  onMouseUp={handleMouseUp}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="flex max-w-xl flex-col gap-4 p-4 bg-white shadow-md rounded-lg">
        {/* Date Display with Subtle Styling */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Hovered Date:</span>
          <span className="text-sm font-medium text-gray-800">
            {dateLabel || "No date selected"}
          </span>
        </div>

        {/* Export Button with Icon and Improved Styling */}
        <button
          onClick={exportJson}
          className="w-full flex items-center justify-center space-x-2 
      bg-blue-500 text-white px-4 py-2 rounded-md 
      hover:bg-blue-600 transition-colors duration-300 
      focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-9.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>Export JSON</span>
        </button>

        {/* Result Display with Improved Layout */}
        {resultJson && (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3 relative">
            {/* Scrollable Pre with Maximum Height */}
            <pre className="text-xs text-gray-700 max-h-48 overflow-auto custom-scrollbar">
              {resultJson}
            </pre>

            {/* Copy to Clipboard Button */}
            <button
              onClick={() => navigator.clipboard.writeText(resultJson)}
              className="absolute top-2 right-2 
          bg-gray-200 text-gray-700 
          hover:bg-gray-300 
          p-2 rounded-md 
          transition-colors duration-300 
          flex items-center space-x-1 
          text-xs"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              <span>Copy</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContributionGridEditor;
