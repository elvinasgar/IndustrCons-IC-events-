tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0B0E14', soft: '#12161F', line: '#1E2430' },
        paper: { DEFAULT: '#F7F7F4', soft: '#EFEEE8', line: '#E2E0D6' },
        blueprint: { 50:'#EEF3FF',100:'#DCE6FF',200:'#B4C8FF',300:'#7E9FFF',400:'#4A72F0',500:'#1E4FD8',600:'#173CAA',700:'#122E82' },
        signal: { DEFAULT: '#F2A93B', soft: '#FBE4B8', deep: '#C97F1B' },
        green: { 50:'#EFFBF1',500:'#1E9E52',600:'#167A40' },
        steel: { 50:'#F5F6F7',100:'#E7E9EC',200:'#CDD2D9',300:'#A7AEB8',400:'#7B8492',500:'#5C6472',600:'#454B57' },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      }
    }
  }
};
