"use client"
import { useState, useEffect } from 'react';

export default function Home() {
  const [status, setStatus] = useState('');
  const [alarm, setAlarm] = useState('');
  const [password, setPassword] = useState('');

  const fetchStatus = async () => {
    try {
      const response = await fetch('http://192.168.4.1/control?cmd=Status,G,21');
      if (response.ok) {
        const data = await response.json();
        if (data.state == '0') {
          setStatus('1');
        } else if (data.state == '1') {
          setStatus('0');
        } else {
          setStatus('Nieznany status');
        }
      } else {
        console.error('Błąd podczas pobierania danych');
      }
    } catch (error) {
      console.error('Błąd podczas pobierania statusu:', error);
    }
  };

  const fetchAlarm = async () => {
    try {
      const response = await fetch('http://192.168.4.1/control?cmd=Status,G,1');
      if (response.ok) {
        const data = await response.json();
        if (data.state == '1') {
          setAlarm('1');
        } else if (data.state == '0') {
          setAlarm('0');
        } else {
          setAlarm('Nieznany status');
        }
      } else {
        console.error('Błąd podczas pobierania danych');
      }
    } catch (error) {
      console.error('Błąd podczas pobierania alarmu:', error);
    }
  };

  const handleButtonClick = async (value: any) => {
    if (value === '#') {
      // Jeśli kliknięto krzyżyk, wyczyść hasło
      setPassword('');
    } else if (value === '*') {
      // Jeśli kliknięto gwiazdkę, wyczyść hasło
      setPassword('');
    } else {
      // W przeciwnym razie dodaj klikniętą wartość do hasła
      setPassword(prevPassword => prevPassword + value);
    }

    // Sprawdź, czy hasło zostało wprowadzone
    console.log("sprawdzanoie hasła...") // "Checking password...
    if (value === '#') {

      // Zweryfikuj wprowadzone hasło
      console.log('Weryfikacja hasłav2');
      if (password == '1234') {
        console.log('Poprawne hasło. Wysyłanie do API...');
        alarm === '0' ? alert('Poprawne hasło. alarm zostanie uzbrojony za 10s') : alert('Poprawne hasło. zmianiam ustawiania alarmu...');
        // Hasło poprawne - wybierz odpowiednie API w zależności od wartości alarmu
        const apiEndpoint = alarm === '0' ? 'http://192.168.4.1/control?cmd=event,alarmOn' : 'http://192.168.4.1/control?cmd=event,alarmOff';
        
        try {
          // Wyślij żądanie POST z hasłem do wybranego API
          const response = await fetch(apiEndpoint, {
            method: 'POST',
            mode: 'no-cors'
          });
        } catch (error) {
          console.error('Wystąpił błąd podczas wysyłania hasła:', error);
        }
      } else {
        // Hasło niepoprawne
        console.error('Niepoprawne hasło. Wprowadź poprawne hasło.');
      }
      
      // Wyczyść hasło po wysłaniu lub w przypadku niepoprawnego hasła
      setPassword('');
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchStatus();
      fetchAlarm();
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  // renderowanie

  let statusColorClass = ''; 
  let statusText = '';
  switch (status) {
    case '1':
      statusColorClass = 'text-red-500';
      statusText = ' wykrycie';
      break;
    case '0':
      statusColorClass = 'text-green-500';
      statusText = ' brak';
      break;
    default:
      statusColorClass = 'text-yellow-500';
      statusText = ' Nieznany status';
  }

  let alarmColorClass = '';
  let alarmText = '';
  switch (alarm) {
    case '1':
      alarmColorClass = 'text-green-500';
      alarmText = ' Alarm uzbrojony';
      break;
    case '0':
      alarmColorClass = 'text-red-500';
      alarmText = ' Alarm rozbrojony';
      break;
    default:
      alarmColorClass = 'text-yellow-500';
      alarmText = ' Nieznany status alarmu';
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full justify-between font-mono text-sm ">
        <h1 className="flex justify-center text-lg">Witaj na stronie konfiguracji alarmu</h1>
        <div className="flex justify-between pt-2 mt-10">
          <div>
            Status alarmu:
            <span className={alarmColorClass}>{alarmText}</span>
            <br />
            Ruch: 
            <span className={statusColorClass}>{statusText}</span>
          </div>
          <div>
            <h2>Uzbrajanie/rozbrajanie alarmu</h2>
            <br />
            <input
              type="password"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={password}
              readOnly
            />
            <br />
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((value) => (
                <button
                  key={value}
                  className="bg-gray-400 p-4"
                  onClick={() => handleButtonClick(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
