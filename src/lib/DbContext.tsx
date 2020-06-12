import React from "react";
import Dexie from "dexie";
import { TAnswerId, TQuestionId } from "../data/Types";
import { defaultResponseId } from "./ResponsesContext";
import { safeRun } from "./HelperFunctions.js";

const DB_NAME = 'aeci-quiz';
const DB_SCHEMA_NAME = 'responses';
const DB_KEY_QUESTION_ID = 'questionId';
const DB_KEY_RESPONSE = 'response';

type TDbContext<Id, Data> = {
  put: (data: Data, id: Id) => Promise<void>;
  get: (id: Id) => Promise<Data>;
  clear: () => Promise<void>;
};

type TResponsesDbData = {
  [DB_KEY_QUESTION_ID]: TQuestionId,
  [DB_KEY_RESPONSE]: TAnswerId
};

type TResponsesDbContext = TDbContext<TQuestionId, TResponsesDbData>;

function buildResponse(questionId: TQuestionId, answerId: TAnswerId = defaultResponseId) {
  return {
    [DB_KEY_QUESTION_ID]: questionId,
    [DB_KEY_RESPONSE]: answerId,
  };
}

export const dbContextDefault: TResponsesDbContext = {
  put: () => Promise.resolve(),
  get: (id: TQuestionId) => Promise.resolve(buildResponse(id)),
  clear: () => Promise.resolve(),
};

const DbContext = React.createContext(dbContextDefault);

export const DbContextProvider = ({children}: { children: React.ReactElement }) => {
  const {close, db} = safeRun(() => {
    const newDb = new Dexie(DB_NAME);
    newDb
      .version(1)
      .stores({[DB_SCHEMA_NAME]: `${DB_KEY_QUESTION_ID},${DB_KEY_RESPONSE}`})

    return {
      close: newDb.close,
      // @ts-ignore
      db: newDb[DB_SCHEMA_NAME] as TResponsesDbContext
    };
  }, {
    close: () => null,
    db: dbContextDefault
  });

  // Close db on unmount
  React.useEffect(() => close, [close]);

  return (
    <DbContext.Provider value={db}>
      {children}
    </DbContext.Provider>
  )
}

export function useDbContext() {
  const db = React.useContext(DbContext);

  const setPersistResponse = React.useCallback((questionId: TQuestionId, response: TAnswerId) => {
    return db.put(buildResponse(questionId, response), questionId)
      .then((...params) => console.log("DbContext:useDbContext", ...params))
  }, [db]);

  const getPersistResponse = React.useCallback(async (questionId: TQuestionId) => {
    return (await db.get(questionId) ?? buildResponse(questionId))[DB_KEY_RESPONSE]
  }, [db]);

  const clearPersistResponses = React.useCallback(async () => {
    return await db.clear()
  }, [db])

  return {
    setPersistResponse,
    getPersistResponse,
    clearPersistResponses,
  }
}
