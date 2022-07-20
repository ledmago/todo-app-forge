import Resolver from "@forge/resolver";
import api, { storage, route } from "@forge/api";
import ForgeUI, {
  render,
  Text,
  IssueAction,
  ModalDialog,
  useState,
  useEffect,
  useProductContext,
} from "@forge/ui";
const resolver = new Resolver();

const getUniqueId = () => "_" + Math.random().toString(36).substr(2, 9);

const getListKeyFromContext = (context) => {
  console.log(context);
  const { localId: id } = context;
  return id.split("/")[id.split("/").length - 1];
};

const getAll = async (listId) => {
  return (await storage.get(listId)) || [];
};

resolver.define("get-all", ({ context }) => {
  return getAll(getListKeyFromContext(context));
});

resolver.define("get-issue-logs", async ({ payload, context }) => {
  const response = await api
    .asApp()
    .requestJira(
      route`/rest/api/3/issue/${context.extension.issue.key}/changelog`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
  const data = await response.json();
  return data;
});

resolver.define("create", async ({ payload, context }) => {
  const listId = getListKeyFromContext(context);
  const records = await getAll(listId);
  const id = getUniqueId();

  const newRecord = {
    id,
    ...payload,
  };

  await storage.set(getListKeyFromContext(context), [...records, newRecord]);

  return newRecord;
});

resolver.define("update", async ({ payload, context }) => {
  const listId = getListKeyFromContext(context);
  let records = await getAll(listId);

  records = records.map((item) => {
    if (item.id === payload.id) {
      return payload;
    }
    return item;
  });

  await storage.set(getListKeyFromContext(context), records);

  return payload;
});

resolver.define("delete", async ({ payload, context }) => {
  const listId = getListKeyFromContext(context);
  let records = await getAll(listId);

  records = records.filter((item) => item.id !== payload.id);

  await storage.set(getListKeyFromContext(context), records);

  return payload;
});

resolver.define("delete-all", ({ context }) => {
  return storage.set(getListKeyFromContext(context), []);
});

export const handler = resolver.getDefinitions();

const IssueApp = () => {
  const [isOpen, setOpen] = useState(true);
  const [csvData, setCsvData] = useState(null);
  const [consoleLog, setConsoleLog] = useState("");

  if (!isOpen) {
    return null;
  }
  const context = useProductContext();
  const fetchCsvData = async () => {
    const response = await api
      .asApp()
      .requestJira(
        route`/rest/api/3/issue/${context.platformContext.issueId}/changelog`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );
    const data = await response.json();

    setCsvData(data);
  };

  useEffect(() => {
    fetchCsvData();
  }, []);
  return (
    <ModalDialog header="Hello" onClose={() => setOpen(false)}>
      <Text>Export data as csv3</Text>
      {csvData && csvData.map((q) => <Text>selam</Text>)}
      <Text>Log : {consoleLog}</Text>
    </ModalDialog>
  );
};

export const exportData = render(
  <IssueAction>
    <IssueApp />
  </IssueAction>
);
