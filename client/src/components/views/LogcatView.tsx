import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import BaseView, {
  BaseViewHeading,
  BaseViewBody,
  BaseViewProps,
  BaseViewHeadingProps,
} from './BaseView';
import { RootState } from '@/store/reducers';

type LogcatViewProps = BaseViewProps & BaseViewHeadingProps;

const LogcatView = ({
  isDraggable = false,
  isUnlocked = false,
}: LogcatViewProps) => {
  const [log, setLog] = useState<string[]>([]);
  const [data, setData] = useState<{ [key: string]: string }>({});

  const packets = useSelector((state: RootState) => state.telemetry);
  useEffect(() => {
    if (packets.length === 0) {
      setLog([]);
      setData({});
      return;
    }

    setLog(
      packets.reduce(
        (acc, { log: newLog }) => (newLog.length === 0 ? acc : newLog),
        log,
      ),
    );

    setData(
      packets.reduce(
        (acc, { data: newData }) =>
          Object.keys(newData).reduce(
            (acc, k) => ({ ...acc, [k]: newData[k] }),
            acc,
          ),
        data,
      ),
    );
  }, [packets]);

const logcatLines = Object.keys(data).map((key) => {
  // Check if the key contains the string "Log Entry "
  if (key.includes("Log Entry ")) {
    return (
      <span
        key={key}
        dangerouslySetInnerHTML={{ __html: `${key}: ${data[key]}<br />` }}
      />
    );
  }

  // Return null or an empty element if the condition is not met
  return null;
});

  const logcatLog = log.map((line, i) => (
    <span key={i} dangerouslySetInnerHTML={{ __html: `${line}<br />` }} />
  ));

  return (
    <BaseView isUnlocked={isUnlocked}>
      <BaseViewHeading isDraggable={isDraggable}>Logcat</BaseViewHeading>
      <BaseViewBody>
        <p style={{ color: 'red' }}>{logcatLines}</p>
        <p style={{ color: 'red' }}>{logcatLog}</p>
      </BaseViewBody>
    </BaseView>
  );
};

export default LogcatView;
