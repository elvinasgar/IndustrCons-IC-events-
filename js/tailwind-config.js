tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#0B0E14', soft: '#12161F', line: '#1E2430' },
        paper: { DEFAULT: '#F7F7F4', soft: '#EFEEE8', line: '#E2E0D6' },
        blueprint: { 50:'#E7F1FC',100:'#C7E1F8',200:'#8FC3F1',300:'#57A5EA',400:'#2C82D2',500:'#025CAB',600:'#014A89',700:'#013967' },
        signal: { 50:'#FFF1E5',100:'#FFDDBD',300:'#FA9A4E',DEFAULT:'#F56C01',deep:'#C25701' },
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
