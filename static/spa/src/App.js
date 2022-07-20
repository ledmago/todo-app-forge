import React, { useEffect, useState, Fragment } from "react";
import { invoke } from "@forge/bridge";

// Atlaskit
import LoadingButton from "@atlaskit/button/loading-button";
import Button from "@atlaskit/button";
import { Checkbox } from "@atlaskit/checkbox";
import EditorCloseIcon from "@atlaskit/icon/glyph/editor/close";
import TrashIcon from "@atlaskit/icon/glyph/trash";
import Textfield from "@atlaskit/textfield";
import Lozenge from "@atlaskit/lozenge";
import Spinner from "@atlaskit/spinner";
import { useProductContext } from "@forge/ui";
import moment from "moment";
// Custom Styles
import {
  Card,
  Row,
  Icon,
  IconContainer,
  Status,
  SummaryActions,
  SummaryCount,
  SummaryFooter,
  ScrollContainer,
  Form,
  LoadingContainer,
} from "./Styles";

import DynamicTable from "@atlaskit/dynamic-table";
import { head, rows, emptyRow } from "./ChangeLogTable";

function App() {
  const [isFetched, setIsFetched] = useState(false);
  const [changeLogs, setChangeLogs] = useState(null);
  const context = useProductContext();
  if (!isFetched) {
    setIsFetched(true);
    invoke("get-issue-logs").then((e) => {
      setChangeLogs(e.values.reverse());
      console.log(e.values);
    });
  }

  if (!changeLogs) {
    return (
      <Card>
        <LoadingContainer>
          <Spinner size="large" />
        </LoadingContainer>
      </Card>
    );
  }
  const getRows = rows(changeLogs);
  const emptyRows = emptyRow;
  const exportToCsv = (filename, rows) => {
    var processRow = function (row) {
      var finalVal = "";
      for (var j = 0; j < row.length; j++) {
        var innerValue = row[j] === null ? "" : row[j].toString();
        if (row[j] instanceof Date) {
          innerValue = row[j].toLocaleString();
        }
        var result = innerValue.replace(/"/g, '""');
        if (result.search(/("|,|\n)/g) >= 0) result = '"' + result + '"';
        if (j > 0) finalVal += ",";
        finalVal += result;
      }
      return finalVal + "\n";
    };

    var csvFile = "";
    for (var i = 0; i < rows.length; i++) {
      csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };
  const exportHandler = () => {
    changeLogs &&
      exportToCsv(
        "export.csv",
        changeLogs.map((logs) => {
          return [
            logs.author.avatarUrls["48x48"],
            logs.author.displayName,
            moment(logs.created).format("DD-MM-YYYY HH:mm"),
            logs.items[0].field,
            logs.items[0].field,
            logs.items[0].fromString,
            logs.items[0].toString,
          ];
        })
      );
  };
  return (
    <Card>
      <ScrollContainer>
        <DynamicTable
          head={head}
          rows={changeLogs?.length > 0 ? getRows : emptyRows}
          rowsPerPage={5}
          defaultPage={1}
          loadingSpinnerSize="large"
          isRankable
        />
        <Button onClick={exportHandler}>Export Change</Button>
      </ScrollContainer>
    </Card>
  );
}

export default App;
