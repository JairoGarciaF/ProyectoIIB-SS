import log from 'loglevel';
import moment from 'moment-timezone';
import { getFirestore, doc, setDoc} from "firebase/firestore"; 
import { getClientIp } from '@/utils/ip';

const firestoreLogger = async (methodName, logLevel, loggerName, ...args) => {
  const timestamp = moment().tz('America/Guayaquil').format('YYYY-MM-DD HH:mm:ss');
  const clientIp = await getClientIp();
  const message = `[${methodName.toUpperCase()}]: ${args.join(' ')}`;

  const db = getFirestore();
  const logDocId = timestamp;
  const logDoc = doc(db, 'logs', logDocId);

  try {
    await setDoc(logDoc, {
      timestamp,
      logLevel,
      message,
      clientIp
    });
  } catch (e) {
    console.error("Error adding document to Firestore: ", e);
  }
};

const originalFactory = log.methodFactory;

log.methodFactory = function (methodName, logLevel, loggerName) {
  const rawMethod = originalFactory(methodName, logLevel, loggerName);

  return function (...args) {
    // Send logs to Firestore without console output
    firestoreLogger(methodName, logLevel, loggerName, ...args);

    /* Optionally, you can still log certain levels to the console if needed
    if (logLevel === 'error') {
      rawMethod(...args); // This will not be executed for security reasons
    }*/
  };
};

log.setLevel('info'); // Puedes ajustar el nivel de logs aquí

export default log;