// ============================================================
// IC EVENT — LİSENZİYA REYESTRİ / LICENSE REGISTRY
// ============================================================
// Yeni lisenziya əlavə etmək üçün aşağıdakı siyahıya bir blok əlavə et
// (vergüllə ayır). Bitmə tarixi avtomatik hesablanır: verilmə + 1 il.
// Status (aktiv / bitib) də avtomatik hesablanır.
//
// To add a new license, copy one block below and edit it. The expiry date
// (issue date + 1 year) and the status are computed automatically.
//
//   code       — unikal lisenziya kodu / unique license code (ICE-İL-NÖMRƏ)
//   eventAz/En — tədbir / lisenziya adı
//   organizer  — təşkilatçının adı soyadı
//   cityAz/En, countryAz/En
//   partner    — tərəfdaş (yoxdursa boş saxla: '')
//   typeAz/En  — lisenziya növü (Standart / Campus / Salon)
//   issued     — verilmə tarixi, YYYY-MM-DD
// ============================================================
var IC_REGISTRY = [
  {
    code: 'ICE-2026-001',
    eventAz: 'IC - MUSIAD Azərbaycan',
    eventEn: 'IC - MUSIAD Azerbaijan',
    organizer: 'Elvin Asgarov',
    cityAz: 'Bakı', cityEn: 'Baku',
    countryAz: 'Azərbaycan', countryEn: 'Azerbaijan',
    partner: 'MÜSİAD',
    typeAz: 'IC Event Standart', typeEn: 'IC Event Standard',
    issued: '2026-08-19'
  }
];
