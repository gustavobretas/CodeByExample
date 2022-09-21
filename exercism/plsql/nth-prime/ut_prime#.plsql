create or replace package prime# as

  invalid_argument_error exception;
  function is_prime(i_number number) return integer;
  function nth(i_nth number) return number;
  
end prime#;
/

create or replace package body prime# as
  
  -- Check if the Number is a Prime Number
  function is_prime(i_number number) return integer is
    squared number;
    divisor number;
    res integer;
  begin
    -- Consider as a Prime Number until is proven it isn't
    res := 1;
    squared := trunc(sqrt(i_number));
    divisor := 2;
    for divisor in 2..squared loop
      -- If the Number is divisible only by 1 and itself, it is a Prime Number
      if mod(i_number, divisor) = 0 and divisor != i_number then
        res := 0;
        exit;
      end if;
    end loop;
    return res;
  end is_prime;

  -- Return N-th Prime number
  function nth(i_nth number) return number is
    i_count integer;
    i_index integer;
    lastPrime number;    
  begin
    if i_nth < 1 then
      raise invalid_argument_error;
    end if;
    i_count := 1;
    -- We know that 2 is the first Prime Number, then it starts from 3
    i_index := 3;
    lastPrime := 2;
    while i_count < i_nth loop
      if is_prime(i_index) = 1 then
        lastPrime := i_index;
        i_count := i_count + 1;
      end if;
      -- Increments 2 because we don't need to check even numbers since the unique even prime number is 2
      i_index := i_index + 2;
    end loop;    
    return lastPrime;
    exception
      when invalid_argument_error then
        raise invalid_argument_error;
  end nth;

end prime#;
/


create or replace package ut_prime#
is
  procedure run;
end ut_prime#;
/
 
create or replace package body ut_prime#
is
  procedure test (
    i_descn                                       varchar2
   ,i_exp                                         number
   ,i_act                                         number
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
    l_act                           number;
  begin
    test(i_descn => 'test_first'     , i_exp => 2     , i_act => prime#.nth(1)    );
    test(i_descn => 'test_second'    , i_exp => 3     , i_act => prime#.nth(2)    );
    test(i_descn => 'test_sixth'     , i_exp => 13    , i_act => prime#.nth(6)    );
    test(i_descn => 'test_big_prime' , i_exp => 104743, i_act => prime#.nth(10001));
    begin
      l_act := prime#.nth(0);
      dbms_output.put_line('FAILURE: test_weird_case - expected invalid_argument_error to be raised, but received ' || nvl('' || l_act, 'null'));
    exception
      when prime#.invalid_argument_error then
        dbms_output.put_line('SUCCESS: test_weird_case');
    end;
  end run;
end ut_prime#;
/
 
begin
  ut_prime#.run;
end;
/
