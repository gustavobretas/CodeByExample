create or replace package binary# is

  function to_decimal(input_number in varchar2) return number;

end binary#;
/
 
create or replace package body binary# is

  function to_decimal(input_number in varchar2) return number as
    b_number number;
    i number := 0;
    len number := 0;
    dec_value number := 0;
    n_mod number := 0;
  begin
    if regexp_instr(input_number, '[a-zA-Z]+|\d[2-9]') > 0 then
      raise_application_error(-20000, 'Invalid binary number');
    end if;
    b_number := to_number(input_number);
    len := length(b_number);
    while len >= 0 loop
      n_mod := mod(b_number, 10);
      dec_value := dec_value + (n_mod * power(2, i));
      len := len - 1;
      i := i + 1;
      b_number := trunc(b_number / 10);
    end loop;
    return dec_value;
    exception
      when others then
        return 0;
  end to_decimal;

end binary#;
/

create or replace package ut_binary#
is
  procedure run;
end ut_binary#;
/
 
create or replace package body ut_binary#
is
  procedure test (
    i_descn                                       varchar2
   ,i_exp                                         pls_integer
   ,i_act                                         pls_integer
  )
  is
  begin
    if i_exp = i_act then
      dbms_output.put_line('SUCCESS: ' || i_descn);
    else
      dbms_output.put_line('FAILURE: ' || i_descn || ' - expected ' || nvl('' || i_exp, 'null') || ', but received ' || nvl('' || i_act, 'null'));
    end if;
  end test;
 
  procedure run
  is
  begin
    test(i_descn => 'test_binary_1_is_decimal_1'              , i_exp => 1   , i_act => binary#.to_decimal('1'          ));
    test(i_descn => 'test_binary_10_is_decimal_2'             , i_exp => 2   , i_act => binary#.to_decimal('10'         ));
    test(i_descn => 'test_binary_11_is_decimal_3'             , i_exp => 3   , i_act => binary#.to_decimal('11'         ));
    test(i_descn => 'test_binary_100_is_decimal_4'            , i_exp => 4   , i_act => binary#.to_decimal('100'        ));
    test(i_descn => 'test_binary_1001_is_decimal_9'           , i_exp => 9   , i_act => binary#.to_decimal('1001'       ));
    test(i_descn => 'test_binary_11010_is_decimal_26'         , i_exp => 26  , i_act => binary#.to_decimal('11010'      ));
    test(i_descn => 'test_binary_10001101000_is_decimal_1128' , i_exp => 1128, i_act => binary#.to_decimal('10001101000'));
    test(i_descn => 'test_invalid_binary_postfix_is_decimal_0', i_exp => 0   , i_act => binary#.to_decimal('10110a'     ));
    test(i_descn => 'test_invalid_binary_prefix_is_decimal_0' , i_exp => 0   , i_act => binary#.to_decimal('a10110'     ));
    test(i_descn => 'test_invalid_binary_infix_is_decimal_0'  , i_exp => 0   , i_act => binary#.to_decimal('101a10'     ));
    test(i_descn => 'test_invalid_binary_is_decimal_0'        , i_exp => 0   , i_act => binary#.to_decimal('101210'     ));
  end run;
end ut_binary#;
/
 
begin
  ut_binary#.run;
end;
/
