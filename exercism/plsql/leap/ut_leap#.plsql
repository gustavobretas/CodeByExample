create or replace package year# as

  function is_leap(i_year number) return varchar2;
  
end year#;
/

create or replace package body year# as

  function is_leap(i_year number) return varchar2 is
  begin
    if mod(i_year, 4) = 0 and mod(i_year, 100) != 0 or mod(i_year, 400) = 0 then
      return 'Yes, ' || i_year ||' is a leap year';
    else
      return 'No, ' || i_year ||' is not a leap year';
    end if;
  end is_leap;
  
end year#;
/

create or replace package ut_year#
is
  procedure run;
end ut_year#;
/
 
create or replace package body ut_year#
is
  procedure test (
    i_descn                                       varchar2
   ,i_exp                                         varchar2
   ,i_act                                         varchar2
  )
  is
  begin
    if i_exp = i_act then
      dbms_output.put_line('SUCCESS: ' || i_descn);
    else
      dbms_output.put_line('FAILURE: ' || i_descn || ' - expected ' || nvl(i_exp, 'null') || ', but received ' || nvl(i_act, 'null'));
    end if;
  end test;
 
  procedure run
  is
  begin
    test(i_descn => 'test_leap_year'         , i_exp => 'Yes, 1996 is a leap year'   , i_act => year#.is_leap(1996));
    test(i_descn => 'test_non_leap_year'     , i_exp => 'No, 1997 is not a leap year', i_act => year#.is_leap(1997));
    test(i_descn => 'test_non_leap_even_year', i_exp => 'No, 1998 is not a leap year', i_act => year#.is_leap(1998));
    test(i_descn => 'test_century'           , i_exp => 'No, 1900 is not a leap year', i_act => year#.is_leap(1900));
    test(i_descn => 'test_fourth_century'    , i_exp => 'Yes, 2400 is a leap year'   , i_act => year#.is_leap(2400));
  end run;
end ut_year#;
/
 
begin
  ut_year#.run;
end;
/
