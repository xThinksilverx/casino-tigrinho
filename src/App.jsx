import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, BarChart3, Trophy, ArrowLeft } from 'lucide-react';

const CasinoApp = () => {
  const [screen, setScreen] = useState('menu'); // menu, slot, stats
  const [credits, setCredits] = useState(1000);
  const [history, setHistory] = useState([{ spin: 0, balance: 1000 }]);
  const [totalSpins, setTotalSpins] = useState(0);
  const [totalWins, setTotalWins] = useState(0);
  const [biggestWin, setBiggestWin] = useState(0);
  const [totalBet, setTotalBet] = useState(0);
  const [totalWon, setTotalWon] = useState(0);

  // Slot Machine States
  const symbols = ['🐯', '💰', '🍒', '🍋', '💎', '⭐', '🎰', '🔔'];
  const [reels, setReels] = useState(['🐯', '🐯', '🐯']);
  const [spinning, setSpinning] = useState(false);
  const [bet, setBet] = useState(10);
  const [message, setMessage] = useState('Boa sorte! 🍀');
  const [winAmount, setWinAmount] = useState(0);

  const getRandomSymbol = () => {
    return symbols[Math.floor(Math.random() * symbols.length)];
  };

  const checkWin = (result) => {
    if (result[0] === result[1] && result[1] === result[2]) {
      if (result[0] === '🐯') {
        return { win: true, multiplier: 50, message: '🎉 JACKPOT DO TIGRINHO! 🐯🐯🐯' };
      } else if (result[0] === '💎') {
        return { win: true, multiplier: 20, message: '💎 DIAMANTES! Vitória Grande!' };
      } else if (result[0] === '💰') {
        return { win: true, multiplier: 15, message: '💰 Moedas de Ouro!' };
      } else {
        return { win: true, multiplier: 10, message: '✨ Combinação Perfeita!' };
      }
    } else if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
      return { win: true, multiplier: 2, message: '🎊 Dupla! Pequena vitória!' };
    }
    return { win: false, multiplier: 0, message: '😢 Não foi dessa vez... Tente novamente!' };
  };

  const spin = () => {
    if (spinning || credits < bet) {
      if (credits < bet) {
        setMessage('❌ Acabou o dinheiro filho!');
      }
      return;
    }

    setSpinning(true);
    const newCredits = credits - bet;
    setCredits(newCredits);
    setTotalSpins(prev => prev + 1);
    setTotalBet(prev => prev + bet);
    setMessage('🎰 Girando...');
    setWinAmount(0);

    let spinCount = 0;
    const spinInterval = setInterval(() => {
      setReels([getRandomSymbol(), getRandomSymbol(), getRandomSymbol()]);
      spinCount++;

      if (spinCount >= 20) {
        clearInterval(spinInterval);
        
        const finalReels = [getRandomSymbol(), getRandomSymbol(), getRandomSymbol()];
        setReels(finalReels);
        
        const result = checkWin(finalReels);
        setMessage(result.message);
        
        if (result.win) {
          const prize = bet * result.multiplier;
          setWinAmount(prize);
          setTotalWins(prev => prev + 1);
          setTotalWon(prev => prev + prize);
          if (prize > biggestWin) setBiggestWin(prize);
          
          setTimeout(() => {
            setCredits(prev => {
              const newBalance = prev + prize;
              setHistory(prev => [...prev, { spin: totalSpins + 1, balance: newBalance }]);
              return newBalance;
            });
          }, 500);
        } else {
          setHistory(prev => [...prev, { spin: totalSpins + 1, balance: newCredits }]);
        }
        
        setSpinning(false);
      }
    }, 100);
  };

  const resetGame = () => {
    setCredits(1000);
    setHistory([{ spin: 0, balance: 1000 }]);
    setTotalSpins(0);
    setTotalWins(0);
    setBiggestWin(0);
    setTotalBet(0);
    setTotalWon(0);
    setMessage('Boa sorte! 🍀');
  };

  // Menu Screen
  if (screen === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-3xl p-8 shadow-2xl max-w-md w-full border-8 border-yellow-500">
          <h1 className="text-5xl font-bold text-white text-center mb-2 drop-shadow-lg">
            CASSINO DO
          </h1>
          <h2 className="text-6xl font-bold text-white text-center mb-8 drop-shadow-lg animate-pulse">
            TIGRINHO 🐯 
          </h2>
          
          <div className="bg-black bg-opacity-50 rounded-lg p-4 mb-6">
            <p className="text-yellow-300 text-2xl font-bold text-center">
              💰 Saldo: {credits}
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setScreen('slot')}
              className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl text-xl font-bold shadow-lg transition-all transform hover:scale-105"
            >
              🎰 JOGAR
            </button>
            
            <button
              onClick={() => setScreen('stats')}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl text-xl font-bold shadow-lg transition-all transform hover:scale-105"
            >
              📊 ESTATÍSTICAS
            </button>

            <button
              onClick={resetGame}
              className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl text-lg font-bold shadow-lg transition-all transform hover:scale-105"
            >
              🔄 RESETAR JOGO
            </button>
          </div>

          <div className="mt-6 bg-black bg-opacity-40 rounded-xl p-4">
            <p className="text-yellow-300 text-center text-sm">
              ⚠️ Este é um jogo de entretenimento, que a linda professora Claudia pediu e os seus queridos alunos Caio, Kaio e Otavio.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Statistics Screen
  if (screen === 'stats') {
    const winRate = totalSpins > 0 ? ((totalWins / totalSpins) * 100).toFixed(1) : 0;
    const netProfit = credits - 1000;
    const roi = totalBet > 0 ? (((totalWon - totalBet) / totalBet) * 100).toFixed(1) : 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center p-4">
        <div className="bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-3xl p-8 shadow-2xl max-w-4xl w-full border-8 border-yellow-500">
          
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setScreen('menu')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
            >
              <ArrowLeft size={20} /> Voltar
            </button>
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">
              📊 ESTATÍSTICAS
            </h1>
            <div className="w-24"></div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-black bg-opacity-50 rounded-xl p-4 text-center">
              <p className="text-yellow-300 text-sm mb-1">Saldo Atual</p>
              <p className="text-white text-2xl font-bold">💰 {credits}</p>
            </div>
            
            <div className="bg-black bg-opacity-50 rounded-xl p-4 text-center">
              <p className="text-yellow-300 text-sm mb-1">Total de Giros</p>
              <p className="text-white text-2xl font-bold">🎰 {totalSpins}</p>
            </div>
            
            <div className="bg-black bg-opacity-50 rounded-xl p-4 text-center">
              <p className="text-yellow-300 text-sm mb-1">Taxa de Vitória</p>
              <p className="text-white text-2xl font-bold">📈 {winRate}%</p>
            </div>
            
            <div className="bg-black bg-opacity-50 rounded-xl p-4 text-center">
              <p className="text-yellow-300 text-sm mb-1">Maior Vitória</p>
              <p className="text-white text-2xl font-bold">🏆 {biggestWin}</p>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-black bg-opacity-50 rounded-xl p-4 text-center">
              <p className="text-yellow-300 text-sm mb-1">Lucro Líquido</p>
              <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {netProfit >= 0 ? '+' : ''}{netProfit}
              </p>
            </div>
            
            <div className="bg-black bg-opacity-50 rounded-xl p-4 text-center">
              <p className="text-yellow-300 text-sm mb-1">Total Apostado</p>
              <p className="text-white text-2xl font-bold">{totalBet}</p>
            </div>
            
            <div className="bg-black bg-opacity-50 rounded-xl p-4 text-center">
              <p className="text-yellow-300 text-sm mb-1">ROI</p>
              <p className={`text-2xl font-bold ${roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {roi}%
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-black bg-opacity-50 rounded-xl p-4">
            <h3 className="text-yellow-300 font-bold mb-4 flex items-center gap-2">
              <TrendingUp size={20} /> Evolução do Capital
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis 
                  dataKey="spin" 
                  stroke="#fcd34d"
                  label={{ value: 'Giros', position: 'insideBottom', offset: -5, fill: '#fcd34d' }}
                />
                <YAxis 
                  stroke="#fcd34d"
                  label={{ value: 'Saldo', angle: -90, position: 'insideLeft', fill: '#fcd34d' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '2px solid #fcd34d', borderRadius: '8px' }}
                  labelStyle={{ color: '#fcd34d' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  // Slot Machine Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-yellow-600 to-yellow-800 rounded-3xl p-8 shadow-2xl max-w-md w-full border-8 border-yellow-500">
        
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setScreen('menu')}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-bold text-sm"
          >
            ← Menu
          </button>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            🐯 TIGRINHO 🐯
          </h1>
          <button
            onClick={() => setScreen('stats')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-bold text-sm"
          >
            📊 Stats
          </button>
        </div>

        <div className="bg-black bg-opacity-50 rounded-lg p-3 mb-4">
          <div className="flex justify-between text-yellow-300">
            <span className="font-bold">💰 Créditos: {credits}</span>
            <span className="font-bold">🎰 Giros: {totalSpins}</span>
          </div>
        </div>

        <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl p-6 mb-4 border-4 border-yellow-400 shadow-inner">
          <div className="flex justify-center gap-3 mb-4">
            {reels.map((symbol, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl w-24 h-24 flex items-center justify-center text-6xl border-4 border-yellow-500 shadow-lg ${
                  spinning ? 'animate-pulse' : ''
                }`}
              >
                {symbol}
              </div>
            ))}
          </div>
          
          {winAmount > 0 && (
            <div className="bg-green-500 rounded-lg p-3 mb-3 animate-pulse">
              <p className="text-white text-2xl font-bold text-center">
                +{winAmount} Créditos! 🎉
              </p>
            </div>
          )}

          <div className="bg-black bg-opacity-50 rounded-lg p-3">
            <p className="text-yellow-300 text-center font-semibold">
              {message}
            </p>
          </div>
        </div>

        <div className="bg-black bg-opacity-30 rounded-xl p-4 mb-4">
          <label className="text-white font-bold block mb-2 text-center">
            💵 Aposta: {bet}
          </label>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setBet(Math.max(10, bet - 10))}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold"
              disabled={spinning}
            >
              -10
            </button>
            <button
              onClick={() => setBet(10)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold"
              disabled={spinning}
            >
              10
            </button>
            <button
              onClick={() => setBet(50)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold"
              disabled={spinning}
            >
              50
            </button>
            <button
              onClick={() => setBet(Math.min(100, bet + 10))}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold"
              disabled={spinning}
            >
              +10
            </button>
          </div>
        </div>

        <button
          onClick={spin}
          disabled={spinning || credits < bet}
          className={`w-full py-4 rounded-xl text-2xl font-bold shadow-lg transition-all transform ${
            spinning || credits < bet
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105 active:scale-95'
          } text-white`}
        >
          {spinning ? '🎰 GIRANDO...' : '🎮 GIRAR'}
        </button>

        <div className="mt-4 bg-black bg-opacity-40 rounded-xl p-3">
          <h3 className="text-yellow-300 font-bold text-center text-sm mb-1">
            📊 Tabela de Prêmios
          </h3>
          <div className="text-white text-xs space-y-0.5">
            <p>🐯🐯🐯 = 50x | 💎💎💎 = 20x | 💰💰💰 = 15x</p>
            <p>Outros 3x = 10x | 2 iguais = 2x</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasinoApp;