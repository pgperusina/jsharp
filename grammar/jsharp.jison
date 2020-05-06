/**
 * JSharp parser
 */

/* Lexical definition */
%lex

%options case-insensitive

%%

/* White spaces */
[ \r\t]+            {}
\n                  {}

/* Comments */
"//".*                             	 	{
                                            console.log("comment one line");
                                            //console.log(yytext);
                                        }
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]     {
                                            console.log("comment ML");
                                            //console.log(yytext);
                                        }

"null"				return 'NULL';
"integer"			return 'INTEGER';
"double"			return 'DOUBLE';
"char"				return 'CHAR';
"boolean"			return 'BOOLEAN';
"import"			return 'IMPORT';
"var"				return 'VAR';
"const"				return 'CONST';
"global"			return 'GLOBAL';
"true"				return 'TRUE';
"false"				return 'FALSE';
"if"				return 'IF';
"else"				return 'ELSE';
"switch"			return 'SWITCH';
"case"				return 'CASE';
"default"			return 'DEFAULT';
"break"				return 'BREAK';
"continue"			return 'CONTINUE';
"return"			return 'RETURN';
"print"				return 'PRINT';
"public"			return 'PUBLIC';
"private"			return 'PRIVATE';
"void"				return 'VOID';
"for"				return 'FOR';
"while"				return 'WHILE';
"define"			return 'DEFINE';
"as"				return 'AS';
"strc"				return 'STRC';
"do"				return 'DO';
"try"				return 'TRY';
"catch"				return 'CATCH';
"throw"				return 'THROW';

","                 return 'COMA';
"."                 return 'PUNTO';
";"                 return 'PCOMA';
"("                 return 'PARIZQ';
")"                 return 'PARDER';
"["                 return 'CORIZQ';
"]"                 return 'CORDER';
"{"                 return 'LLAVIZQ';
"}"                 return 'LLAVDER';
":="                return 'DPIGUAL';
":"                 return 'DOSPUNTOS';
"++"                return 'OPINCREMENTO';
"+"                 return 'MAS';
"--"                return 'OPDECREMENTO';
"-"                 return 'MENOS';
"*"                 return 'POR';
"/"                 return 'DIVIDIDO';
"%"                 return 'MODULO';
"^^"                return 'POWER';
"^"              	return 'XOR';
"||"             	return 'OR';
"&&"            	return 'AND';
"==="               return 'TRIPLEIGUAL';
"=="                return 'IGUALA';
"!="                return 'DIFERENTEDE';
"<="                return 'MENORIGUAL';
">="                return 'MAYORIGUAL';
"="                 return 'IGUAL';
">"                	return 'MAYOR';
"<"                	return 'MENOR';
"!"                	return 'NOT';
"$"                	return 'DOLAR';

\"[^\"]*\"				    { 
								yytext = yytext.substr(1,yyleng-2); return 'CADENA'; 
							}
\'[a-zA-ZñÑ^\']\'				    { 
								yytext = yytext.substr(1,yyleng-2); return 'CARACTER'; 
							}
[0-9]+("."[0-9]+)\b         return 'DECIMAL';
[0-9]+\b                    return 'ENTERO';
([a-zA-Z0-9\.\-ñÑ])+[j]		return 'ARCHIVO';
([a-zA-Z_])[a-zA-Z0-9_ñÑ]*	return 'IDENTIFICADOR';

<<EOF>>                     return 'EOF';
.                           { 
								console.error('Error Léxico: ' + yytext + 
								', en la linea: ' + yylloc.first_line + ', y la columna: ' + yylloc.first_column); 
							}
							
/lex

/* Precedence and association - lower to higher*/
/* %left CAST
%right IGUAL
%right OPINCREMENTO OPDECREMENTO
%left AND
%left OR
%left XOR
%left IGUALA DIFERENTEDE TRIPLEIGUAL
%nonassoc MENOR MAYOR MENORIGUAL MAYORIGUAL
%left MAS MENOS
%left POR DIVIDIDO MODULO
%left PUNTO
%right POWER
%right UMENOS NOT */

%start initial

%% /* Grammar definition */

initial
	: instrucciones EOF
;

instrucciones
	: instrucciones instruccion {
		$$ = $1;
		$$.push($2);
	}
	| instruccion {
		$$ = [$1];
	}
;

instruccion
	: imports PCOMA { 
		$$ = $1;
		console.log("INSTRUCCION IMPORTS " + $1);
	}
	/* print */
	/* | asignacion PCOMA {
		$$ = $1;
	} */
	/* | if {
		$$ = $1;
	}
	| switch {
		$$ = $1;
	}
	| while {
		$$ = $1;
	}
	| doWhile {
		$$ = $1;
	}
	| for {
		$$ = $1;
	} */
	| break PCOMA {
		$$ = $1;
	}
	| continue PCOMA {
		$$ = $1;
	}
	| return PCOMA {
		$$ = $1;
	}
/* 	| funcion {
		$$ = $1;
	} */
	/* | llamada PCOMA {
		$$ = $1;
		console.log("LLAMADA -- " + $$);
	} */
	| print PCOMA {
		$$ = $print;
	}
	| expresion PCOMA {
		$$ = $1;
	}
	/* | trycatch {
		$$ = $1;
	}
	| throw PCOMA {
		$$ = $1;
	} */
/* 	| asignacionArreglo {
		$$ = $1;
	} */
	| error PCOMA {
			console.error('Error sintáctico: ' + yytext + ', en la linea: ' + this._$.first_line + ', en la columna: ' + this._$.first_column); 
			//$$ = "ERROR"
	}
;

// IMPORTS

imports
	: IMPORT import  {
			$$ = $2;
			//todo crear nodo (import)
		}
;

import
	: import COMA ARCHIVO {
			$$ = $1;
			$$.push($3);
		}
	| ARCHIVO {
			$$ = [$1];
		}
;

// DECLARACIONES Y ASIGNACIONES

declaracion
	: type lista_id IGUAL expresion {
		$$ = $1 + " " + $2 + " = " + $4;
		console.log("declaracion 1 --" + $1 + " " + $2 + " = " + $4);
		// todo - crear nodo declaracion
	}
	| VAR IDENTIFICADOR DPIGUAL expresion {
		$$ = $1 + " " + $2 + " := " + $4;
		console.log("declaracion 2 --" + $1 + " " + $2 + " := " + $4);
		// todo - crear nodo declaracion
	}
	| CONST IDENTIFICADOR DPIGUAL expresion {
		$$ = $1 + " " + $2 + " := " + $4;
		console.log("declaracion 3 --" + $1 + " " + $2 + " := " + $4);
		// todo - crear nodo declaracion
	}
	| GLOBAL IDENTIFICADOR DPIGUAL expresion {
		$$ = $1 + " " + $2 + " := " + $4;
		console.log("declaracion 4 --" + $1 + " " + $2 + " := " + $4);
		// todo - crear nodo declaracion
	}
	| type lista_id {
		$$ = $1 + " " +  $2;
		console.log("declaracion 5 --" + $1 + " " +  $2);
		// todo - crear nodo declaracion
	}
	| type lista_id IGUAL STRC type {
		$$ = $1 + " " + $2 + " = " + $4 + $5;
		console.log("DECLARACION ARREGLOS --" + $$);
		// todo - crear nodo declaracion
	}
	| ids_anidados IGUAL expresion {
		$$ = $1 + $2 + $3;
		console.log("ASIGNACION -- " + $1 + $2 + $3);
		// todo - crear nodo ASIGNACION
	}
	| type IGUAL expresion {
		$$ = $1 + $2 + $3;
		console.log("ASIGNACION A ARREGLO -- " + $$);
	}
;

type
	: tipo CORIZQ CORDER {
		$$ = $1 + $2 + $3;
		console.log("TYPE -- " + $$);
		// todo - crear nodo tipo diferenciando array de variable
	}
	| tipo CORIZQ expresion CORDER {
		$$ = $1 + $2 + $3 + $4;
		console.log("TYPE -- " + $$);
		// todo - crear nodo tipo diferenciando array de variable
	}
	| tipo {
		$$ = $1;
		console.log("TYPE -- " + $$);
		// todo - crear nodo tipo diferenciando array de variable
	}
;

tipo
	: INTEGER {
		$$ = $1;
	}
	| DOUBLE {
		$$ = $1;
	}
	| CHAR {
		$$ = $1;
	}
	| BOOLEAN {
		$$ = $1;
	}
	| VOID {
		$$ = $1;
	}
	/* | IDENTIFICADOR {
		$$ = $1;
	} */
	/* | ids_anidados {
		$$ = $1;
	} */
;

ids_anidados
	: ids_anidados PUNTO expresionAcceso  {
		$$=[];
		$$.push($1);
		$$.push($3);
		console.log("IDS ANIDADOS!! -- " +$$);
	}
	| expresionAcceso {
		$$ = [$1];
	}
/* 	| ids_anidados PUNTO llamada
	 {
		$$=[];
		$$.push($1);
		$$.push($3);
		console.log("IDS ANIDADOS!! -- " +$$);
	}
	| llamada {
		$$ = $1;
	}
	| IDENTIFICADOR {
		$$ = $1;
	} */
	/* | IDENTIFICADOR PARIZQ PARDER {
		// espero una llamada o identificador - llamada() o ID
		$$ = [$1];
	} */
;

lista_id
	: lista_id COMA IDENTIFICADOR {
		$$ = $1;
		$$.push($3);
	}
	| IDENTIFICADOR {
		$$ = [$1];
	}
;

//CONTROL DE FLUJO

if
	: IF PARIZQ expresion PARDER bloqueInstrucciones { 
			console.log("IF -- " + $1 + " " + $3);
			// todo -- crear nodo de if
		}
	| IF PARIZQ expresion PARDER bloqueInstrucciones ELSE  if { 
			console.log("IF ELSE IF -- " + $1 + " " + $3 + " ELSE IF ");
			// todo -- crear nodo de if
		}
	| IF PARIZQ expresion PARDER bloqueInstrucciones ELSE bloqueInstrucciones { 
			console.log("IF ELSE -- " + $1 + " " + $3 + " ELSE ");
			// todo -- crear nodo de if
		}
;

bloqueInstrucciones
	: LLAVIZQ instrucciones LLAVDER {
		// todo -- crear lista de instrucciones
		$$ = $2;
		console.log("BLOQUE INSTRUCCIONES -- " + $2);
	}
;

switch
	: SWITCH PARIZQ expresion PARDER LLAVIZQ cases LLAVDER {
		console.log($1 + " " + $3 + " " + $6);
		// todo - crear nodo switch
	}
;

cases
	: cases case {
		$$ = $1;
		$$.push($2);
	}
	| case {
		$$ = [$1];
	}
; 

case
	: CASE expresion DOSPUNTOS instrucciones {
		$$ = $1 + " " + $2 + " " + $3 + " " + $4;
		// todo - crear nodo case
	}
	| DEFAULT DOSPUNTOS instrucciones {
		$$ = $1 + " " + $2 + " " + $3;
		// todo - crear nodo case default
	}
;

while
	: WHILE PARIZQ expresion PARDER bloqueInstrucciones {
		console.log($1 + " " + $2 + " " + $3 + " " + $4 + " " + $5);
		// todo - crear nodo while
	}
;

doWhile
	: DO bloqueInstrucciones WHILE PARIZQ expresion PARDER {
		console.log($1 + " " + $2 + " " + $3 + " " + $5);
		// todo - crear nodo dowhile
	}
;

for
	: FOR PARIZQ inicio  condicion  final PARDER bloqueInstrucciones {
		console.log($1 + " " + $3 + ";" + $4 + $5 + " " + $7);
		// todo - crear nodo for
	}
;

inicio
	: declaracion PCOMA { $$ = $1;}
	| PCOMA { console.log("PCOMA INICIO FOR ---- " +yytext);}
;

condicion
	: expresion PCOMA { $$ = $1;}
	| PCOMA { console.log("PCOMA CONDICION FOR ---- " +yytext);}
;

final
	: expresion { $$ = $1;}
	| { console.log("EMPTY FINAL FOR ---- " +yytext);}
;

break
	: BREAK {
		$$ = $1;
		// todo - crear nodo break
	}
;

continue
	: CONTINUE {
		$$ = $1;
		// todo - crear nodo continue
	}
;

return
	: RETURN expresion {
		$$ = $1 + " " + $2;
		// todo - crear nodo return
	}
;

//CASTEO


//FUNCIONES

funcion
	: type IDENTIFICADOR PARIZQ listaParametros PARDER bloqueInstrucciones {
		$$ = $1 + " " + $2 + "(" + $listaParametros + ")" + $bloqueInstrucciones;
		console.log($$);
		// todo - crear nodo FUNCION
	}
;

listaParametros
	: listaParametros COMA parametro {
		$$ = $1;
		$$.push($3);
	}
	| parametro {
		$$ = [$1];
	}
;

parametro
	: type IDENTIFICADOR {
		$$ = $1 + " " + $2;
	}
;

llamada
	: IDENTIFICADOR PARIZQ listaArgumentos PARDER {
		$$ = $1 + "(" + $3 + ")";
		console.log("LLAMADA  -- " +$$);
		// todo - crear nodo llamada
	}
	/* | ids_anidados PARIZQ listaArgumentos PARDER {
		$$ = $1 + $2 + $3 + $4;
		console.log("LLAMADA ANIDADOS -- " +$$);
	} */

;


listaArgumentos
	: listaArgumentos COMA argumento {
		$$ = $1;
		$$.push($3);
		console.log("ARGUMENTOS - " + $$);
	}
	| argumento {
		$$ = [$1];
		console.log("ARGUMENTO -- " + $$);
	}
	| {
		$$ = "";
		console.log("ARGUMENTO EMPTY!!!!");
	}
;

argumento
	: IDENTIFICADOR IGUAL expresion {
		$$ = $1 + "=" + $3;
		console.log($$);
	}
	| expresion {
		$$ = $1;
		console.log($$);
	}
	| DOLAR IDENTIFICADOR{
		$$ = $1 + $2;
		console.log("ARGUMENTO DOLAR " + $$);
	}
;

print
	: PRINT PARIZQ expresion PARDER {
		$$ = $PRINT + $2 + $3 + $4;
		console.log("FUNCION PRINT -- " +$$);
	}
;

trycatch
	: TRY bloqueInstrucciones CATCH PARIZQ IDENTIFICADOR IDENTIFICADOR PARDER bloqueInstrucciones {
		$$ = $2 + $3 + $4 + $5 + $6 + " " +$7 + $8;
		console.log($$);
	}
;

throw
	: THROW STRC llamada {
		$$ = $1 + " " + $2 + " " + $3;
		console.log($$);
	}
;

accesoArreglo
	: IDENTIFICADOR CORIZQ expresion CORDER {
		$$ = $1 + $2 + $3 + $4;
		console.log("ACCESO A ARREGLO --" + $$);
	}
;

expresion
	: expresionAsignacion {
		$$ = $1;
		console.log($$);
	}
/* 	| expresion COMA expresionAsignacion {
		$$ = $1 + $2 + $3;
	} */
;

expresionAsignacion
	: expresionOrExclusivo {
		$$ = $1;
	}
	| expresionAsignacion IGUAL expresionOrExclusivo {
		$$ = $1 + $2 + $3 + "ss";
	}
;

expresionOrExclusivo
	: expresionOr {
		$$ = $1;
	}
	| expresionOrExclusivo XOR expresionOr {
		$$ = $1 + $2 + $3;
	}
;

expresionOr
	: expresionAnd {
		$$ = $1;
	}
	| expresionOr OR expresionAnd {
		$$ = $1 + $2 + $3;
	}
;

expresionAnd
	: expresionIgualdad {
		$$ = $1;
	}
	| expresionAnd AND expresionIgualdad {
		$$ = $1 + $2 + $3;
	}
;

expresionIgualdad
	: expresionRelacional {
		$$ = $1;
	}
	| expresionIgualdad TRIPLEIGUAL expresionRelacional {
		$$ = $1 + $2 + $3;
	}
	| expresionIgualdad IGUALA expresionRelacional {
		$$ = $1 + $2 + $3;
	}
	| expresionIgualdad DIFERENTEDE expresionRelacional {
		$$ = $1 + $2 + $3;
	}
;

expresionRelacional
	: expresionAditiva {
		$$ = $1;
	}
	| expresionRelacional MAYOR expresionAditiva {
		$$ = $1 + $2 + $3;
	}
	| expresionRelacional MAYORIGUAL expresionAditiva {
		$$ = $1 + $2 + $3;
	}
	| expresionRelacional MENOR expresionAditiva {
		$$ = $1 + $2 + $3;
	}
	| expresionRelacional MENORIGUAL expresionAditiva {
		$$ = $1 + $2 + $3;
	}
;

expresionAditiva
	: expresionMultiplicativa {
		$$ = $1;
	}
	| expresionAditiva MAS expresionMultiplicativa {
		$$ = $1 + $2 + $3;
	}
	| expresionAditiva MENOS expresionMultiplicativa {
		$$ = $1 + $2 + $3;
	}
;

expresionMultiplicativa
	: expresionCasteo {
		$$ = $1;
	}
	| expresionMultiplicativa POR expresionCasteo {
		$$ = $1 + $2 + $3;
	}
	| expresionMultiplicativa DIVIDIDO expresionCasteo {
		$$ = $1 + $2 + $3;
	}
	| expresionMultiplicativa MODULO expresionCasteo {
		$$ = $1 + $2 + $3;
	}
;

expresionCasteo
	: expresionUnaria {
		$$ = $1;
	}
	| PARIZQ tipo PARDER expresionCasteo {
		$$ = $1 + $2 + $3 + $4;
	}
;

expresionUnaria
	: expresionPostfix {
		$$ = $1;
	}
	| NOT expresionUnaria {
		$$ = $1 + $2;
	}
	| MENOS expresionUnaria %prec UMENOS {
		$$ = $1 + $2;
	}
	/* | expresionUnaria POWER expresionUnaria {
		$$ = $1 + $2 + $3;
	} */
;

expresionPostfix
	: expresionPrimaria {
		$$ = $1;
	}
	| expresionPostfix CORIZQ expresion CORDER {
		$$ = $1 + $2 + $3 + $4;
	}
	| expresionPostfix PARIZQ PARDER {
		$$ = $1 + $2 + $3;
	}
	| expresionPostfix PARIZQ expresionListaArgumentos PARDER {
		$$ = $1 + $2 + $3 + $4;
	}
	| expresionPostfix PUNTO IDENTIFICADOR {
		$$ = $1 + $2 + $3;
	}
	| expresionPostfix POWER {
		$$ = $1 + $2;
	}
	| expresionPostfix OPINCREMENTO {
		$$ = $1 + $2;
	}
	| expresionPostfix OPDECREMENTO {
		$$ = $1 + $2;
	}
;

expresionListaArgumentos
	: expresionAsignacion {
		$$ = $1;
	}
	| expresionListaArgumentos COMA expresionAsignacion {
		$$ = $1+ $2 + $3;
	}
;

expresionPrimaria
	: IDENTIFICADOR {
		$$ = $1;
	}
	| CADENA {
		$$ = $1;
	}
	| CARACTER {
		$$ = $1;
	}
	| ENTERO {
		$$ = Number($1);
	}
	| DECIMAL {
		$$ = Number($1);
	}
	| TRUE {
		$$ = $1
	}
	| FALSE {
		$$ = $1
	}
	| PARIZQ expresion PARDER {
		$$ = $1 + $2 + $3;
	}
;

/* expresion
	: expresion OPINCREMENTO    	{ $$ = $1 + 1; }
	| expresion OPDECREMENTO    	{ $$ = $1 - 1; }
	| expresion MAS expresion       { $$ = $1 + $3; }
	| expresion MENOS expresion     { $$ = $1 - $3; }
	| expresion POR expresion       { $$ = $1 * $3; }
	| expresion DIVIDIDO expresion  { $$ = $1 / $3; }
	| expresion MODULO expresion  	{ $$ = $1 % $3; }
	| expresion POWER expresion		{ $$ = $1 * $1;}
	| expresion XOR expresion		{ $$ = $1 ^ $3; }
	| expresion OR expresion		{ $$ = $1 || $3; }
	| expresion AND expresion		{ $$ = $1 && $3; }
	| expresion MENORIGUAL expresion	{ $$ = $1 <= $3; }
	| expresion MAYORIGUAL expresion	{ $$ = $1 >= $3; }
	| expresion MENOR expresion		{ $$ = $1 < $3; }
	| expresion MAYOR expresion		{ $$ = $1 > $3; }
	| expresion IGUALA expresion	{ $$ = $1 == $3; }
	| expresion TRIPLEIGUAL expresion	{ $$ = $1 === $3; }
	| expresion DIFERENTEDE expresion	{ $$ = $1 != $3; }
	| MENOS expresion %prec UMENOS   { $$ = $2 *-1; }
	| NOT expresion 				 { $$ = !$2; }
	
	| llamada {
		$$ = $1;
	}
	
	| ENTERO                        { $$ = Number($1); }
	| DECIMAL                       { $$ = Number($1); }
	| TRUE                      	{ $$ = Boolean($1); }
	| FALSE                       	{ $$ = Boolean($1); }
	| IDENTIFICADOR					{ $$ = $1; }
	| CADENA {
		$$ = $1;
	}
	| CARACTER {
		$$ = $1;
	}
	| LLAVIZQ listaArgumentos LLAVDER { 
		$$ = $2;
		console.log("lista expresiones inicializacion arreglos -- " + $$); 
	}
	| accesoArreglo {
		$$ = $1;
		console.log("Acceso a arreglo en EXP -- " + $$);
	}
	| PARIZQ expresion PARDER       { $$ = $2; }
	
; */