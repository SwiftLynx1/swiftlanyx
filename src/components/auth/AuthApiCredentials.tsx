import { memo, useState } from '../../lib/teact/teact';

import { saveApiCredentials } from '../../privatex/apiCredentials';

import useLang from '../../hooks/useLang';
import useLastCallback from '../../hooks/useLastCallback';

import Button from '../ui/Button';
import InputText from '../ui/InputText';

type OwnProps = {
  onSave: NoneToVoidFunction;
};

const API_ID_REGEX = /^\d+$/;
const API_HASH_REGEX = /^[a-f0-9]{32}$/i;
const API_DEVELOPMENT_URL = 'https://my.telegram.org/apps';

const AuthApiCredentials = ({ onSave }: OwnProps) => {
  const lang = useLang();

  const [apiId, setApiId] = useState('');
  const [apiHash, setApiHash] = useState('');
  const [hasApiIdError, setHasApiIdError] = useState(false);
  const [hasApiHashError, setHasApiHashError] = useState(false);

  const handleApiIdChange = useLastCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setApiId(e.target.value.trim());
    setHasApiIdError(false);
  });

  const handleApiHashChange = useLastCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setApiHash(e.target.value.trim());
    setHasApiHashError(false);
  });

  const handleSubmit = useLastCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isApiIdValid = API_ID_REGEX.test(apiId) && Number(apiId) > 0;
    const isApiHashValid = API_HASH_REGEX.test(apiHash);
    setHasApiIdError(!isApiIdValid);
    setHasApiHashError(!isApiHashValid);
    if (!isApiIdValid || !isApiHashValid) return;

    saveApiCredentials({ apiId: Number(apiId), apiHash: apiHash.toLowerCase() });
    onSave();
  });

  return (
    <div id="auth-api-credentials-form" className="custom-scroll">
      <div className="auth-form">
        <div id="logo" />
        <h1>{lang('PrivateXApiTitle')}</h1>
        <p className="note">
          {lang('PrivateXApiNote', {
            link: (
              <a href={API_DEVELOPMENT_URL} target="_blank" rel="noopener noreferrer">my.telegram.org</a>
            ),
          }, { withNodes: true })}
        </p>
        <form className="form" action="" onSubmit={handleSubmit}>
          <InputText
            id="sign-in-api-id"
            label={lang('PrivateXApiId')}
            value={apiId}
            error={hasApiIdError ? lang('PrivateXApiIdInvalid') : undefined}
            inputMode="numeric"
            autoComplete="off"
            onChange={handleApiIdChange}
          />
          <InputText
            id="sign-in-api-hash"
            label={lang('PrivateXApiHash')}
            value={apiHash}
            error={hasApiHashError ? lang('PrivateXApiHashInvalid') : undefined}
            autoComplete="off"
            onChange={handleApiHashChange}
          />
          <Button className="auth-button" type="submit" ripple>
            {lang('LoginNext')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default memo(AuthApiCredentials);
