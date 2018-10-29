#include <stdio.h>
#include <string.h>
#include <stdbool.h>

struct Stack {
    char ctt[32];
    char top;
};

bool isEmpty(struct Stack *stk) { return stk->top == 0; }

char pop(struct Stack *stk) {
    if (isEmpty(stk)) {
        return -1;
    }
    stk->top -= 1;
    return stk->ctt[stk->top + 1];
}

char top(struct Stack *stk) {
    if (isEmpty(stk)) {
        return -1;
    }
    return stk->ctt[stk->top];
}

void push(struct Stack *stk, char val) {
    stk->top += 1;
    stk->ctt[stk->top] = val;
}

bool charIsNum(char x) { return (x >= '0' && x <= '9') ? true : false; }

bool charIsOpr(char x) {
    return (x == '+' || x == '-' || x == '*' || x == '/') ? true : false;
}

bool charIsOpenParen(char x) { return (x == '(') ? true : false; }

bool charIsCloseParen(char x) { return (x == ')') ? true : false; }

bool notPriorThan(char x, char y) {
    int xPr = (x == '+' || x == '-') ? 0 : 1;
    int yPr = (x == '*' || x == '/') ? 1 : 0;
    return (xPr <= yPr) ? true : false;
}

int main() {
    // init a stack
    struct Stack stack;
    stack.top = 0;
    // get expression from input
    char exp[64];
    scanf("%s", exp);
    // init a buffer
    char buffer[32];  // to save number
    int i, ncount = 0;
    for (i = 0; i < strlen(exp); i++) {
        if (charIsNum(exp[i])) {  // if number
            printf("%c ", (exp[i]));
        } else if (charIsOpr(exp[i])) { // if Opr
            if (isEmpty(&stack)) { // directly push
                push(&stack, exp[i]);
            } else {
                while (charIsOpr(top(&stack))) { //pop all opr which is not before the current one
                    printf("%c ", pop(&stack));
                }
                push(&stack, exp[i]);
            }
        } else if (charIsOpenParen(exp[i])) { // directly push '('
            push(&stack, exp[i]);
        } else if (charIsCloseParen(exp[i])) {
            while (!charIsOpenParen(top(&stack))) { // pop all opr until it's nearest '('
                printf("%c ", pop(&stack));
            }
            pop(&stack); // pop '('
        }
    }
    while (!isEmpty(&stack)) { //pop all op
        printf("%c ", pop(&stack));
    }
    printf("\n");
    return 0;
}