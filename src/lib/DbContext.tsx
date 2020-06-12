import React from "react";
import Dexie from "dexie";
import { TAnswerId, TQuestionId } from "../data/Types";
import { defaultResponseId } from "./ResponsesContext";
import { safeRun } from "./HelperFunctions.js";

const DB_NAME = 'aeci-quiz';
const DB_RESPONSES_SCHEMA_NAME = 'responses';
const DB_SETTINGS_SCHEMA_NAME = 'settings';
const DB_KEY_QUESTION_ID = 'questionId';
const DB_KEY_RESPONSE = 'response';
const DB_SETTING_KEY = 'settingKey';
const DB_SETTING_VALUE = 'settingValue';
const DB_SETTINGS_KEY_LAST_SET_QUESTION = 'lastSetQuestion';

// lastSetQuestionId
type TDbContext<Id, Data> = {
  put: (data: Data, id: Id) => Promise<void>;
  get: (id: Id) => Promise<Data>;
  clear: () => Promise<void>;
};

type TResponsesDbData = {
  [DB_KEY_QUESTION_ID]: TQuestionId,
  [DB_KEY_RESPONSE]: TAnswerId
};

type TSettingsDbData = {
  [DB_SETTING_KEY]: string,
  [DB_SETTING_VALUE]: string | null,
};

type TResponsesDbContext = TDbContext<TQuestionId, TResponsesDbData>;
type TSettingsDbContext = TDbContext<string, TSettingsDbData>;

function buildResponse(questionId: TQuestionId, answerId: TAnswerId = defaultResponseId) {
  return {
    [DB_KEY_QUESTION_ID]: questionId,
    [DB_KEY_RESPONSE]: answerId,
  };
}

function buildSetting(key: string, value: string | null) {
  return {
    [DB_SETTING_KEY]: key,
    [DB_SETTING_VALUE]: value,
  };
}

export const respDbDefault: TResponsesDbContext = {
  put: () => Promise.resolve(),
  get: (id: TQuestionId) => Promise.resolve(buildResponse(id)),
  clear: () => Promise.resolve(),
};

export const settingsDbDefault: TSettingsDbContext = {
  put: () => Promise.resolve(),
  get: (key: string) => Promise.resolve(buildSetting(key, null)),
  clear: () => Promise.resolve(),
};

const DbContext = React.createContext({
  respDb: respDbDefault,
  settingsDb: settingsDbDefault
});

export const DbContextProvider = ({children}: { children: React.ReactElement }) => {
  const {close, respDb, settingsDb} = safeRun(() => {
    const newDb = new Dexie(DB_NAME);
    newDb
      .version(1)
      .stores({
        [DB_RESPONSES_SCHEMA_NAME]: `${DB_KEY_QUESTION_ID},${DB_KEY_RESPONSE}`,
        [DB_SETTINGS_SCHEMA_NAME]: `${DB_SETTING_KEY},${DB_SETTING_VALUE}`
      })

    return {
      close: newDb.close,
      // @ts-ignore
      respDb: newDb[DB_RESPONSES_SCHEMA_NAME] as TResponsesDbContext,
      // @ts-ignore
      settingsDb: newDb[DB_SETTINGS_SCHEMA_NAME] as TSettingsDbContext,
    };
  }, {
    close: () => null,
    respDb: respDbDefault,
    settingsDb: settingsDbDefault
  });

  // Close db on unmount
  React.useEffect(() => close, [close]);

  return (
    <DbContext.Provider value={{respDb, settingsDb}}>
      {children}
    </DbContext.Provider>
  )
}

export function useDbContext() {
  const {respDb, settingsDb} = React.useContext(DbContext);

  const setPersistResponse = React.useCallback(async (questionId: TQuestionId, response: TAnswerId) => {
    await respDb.put(buildResponse(questionId, response), questionId)
      .then((...params) => console.log("DbContext:useDbContext", ...params))

    await settingsDb.put(buildSetting(DB_SETTINGS_KEY_LAST_SET_QUESTION, `${questionId}`), DB_SETTINGS_KEY_LAST_SET_QUESTION)
      .then((...params) => console.log("DbContext:useDbContext", ...params, questionId))
  }, [respDb, settingsDb]);

  const getPersistResponse = React.useCallback(async (questionId: TQuestionId) => {
    return (await respDb.get(questionId) ?? buildResponse(questionId))[DB_KEY_RESPONSE]
  }, [respDb]);

  const clearPersistResponses = React.useCallback(async () => {
    await respDb.clear()
    await settingsDb.put(buildSetting(DB_SETTINGS_KEY_LAST_SET_QUESTION, null), DB_SETTINGS_KEY_LAST_SET_QUESTION)
  }, [respDb, settingsDb])

  const getLastSetQuestionId = React.useCallback(async () => {
    return await settingsDb.get(DB_SETTINGS_KEY_LAST_SET_QUESTION)
      .then(setting => setting[DB_SETTING_VALUE])
  }, [settingsDb])

  return {
    getLastSetQuestionId,
    setPersistResponse,
    getPersistResponse,
    clearPersistResponses,
  }
}
