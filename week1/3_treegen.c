#include <stdbool.h>
#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

bool failed;
char s[128];
int nodeN = 0;  // to record the amount of nodes created.

/* BinTree */

typedef struct Node {  // Treenode
    bool hasVal;
    int val;
    struct Node *left, *right;
} BinTree;
BinTree *root;
BinTree temp[];  // to save nodes created by function newNode createNode()
BinTree *newNode() {
    temp[nodeN].hasVal = false;
    temp[nodeN].left = NULL;
    temp[nodeN].right = NULL;
    temp[nodeN].val = NULL;
    return &temp[nodeN++];
}
void createNode(int val, char *inp) {
    int len = strlen(inp);
    BinTree *curNode = root;  // beginning with root
    int i;
    for (i = 0; i < len && failed != true; i++) {
        // printf("loop %d with '%c'\n", i, inp[i]);
        if (inp[i] == 'L') {
            if (curNode->left == NULL) {
                // printf("to L\n");
                curNode->left = newNode();
            }
            curNode = curNode->left;
        } else if (inp[i] == 'R') {
            if (curNode->right == NULL) {
                // printf("to R\n");
                curNode->right = newNode();
            }
            curNode = curNode->right;
        }
    }
    if (curNode->hasVal) {
        failed = true;
        printf("Format Error!\n");
    }
    curNode->val = val;
    curNode->hasVal = true;
}
bool isNEmpty(BinTree *node) {
    return (node == NULL || !node->hasVal) ? true : false;
}

/* Stack */

typedef struct Stack {  // only used to save Bintree Nodes
    BinTree *ctt[64];
    int top;
} Stack;
bool isEmpty(Stack *stk) { return stk->top == 0; }
BinTree *pop(Stack *stk) {
    if (isEmpty(stk)) {
        return -1;
    }
    stk->top -= 1;
    return stk->ctt[stk->top + 1];
}
BinTree *top(Stack *stk) {
    if (isEmpty(stk)) {
        return -1;
    }
    return stk->ctt[stk->top];
}
void push(Stack *stk, BinTree *val) {
    stk->top += 1;
    stk->ctt[stk->top] = val;
}

/* Queue */

struct QNode {  // Queue Node
    BinTree *key;
    struct QNode *next;
};
struct Queue {  // Queue itself
    struct QNode *front, *rear;
};
struct QNode *newQNode(BinTree *k) {
    struct QNode *temp = (struct QNode *)malloc(
        sizeof(struct QNode));  // malloc is to apply for mem
    temp->key = k;
    temp->next = NULL;  // next is for
    return temp;
}
struct Queue *createQueue() {  // with void front and rear
    struct Queue *q = (struct Queue *)malloc(sizeof(struct Queue));
    q->front = q->rear = NULL;  // an empty queue don't have front or rear
    return q;
}
bool isQEmpty(struct Queue *q) {
    return (q->front == NULL || NULL == q->rear) ? true : false;
}
void enQueue(struct Queue *q, BinTree *k) {
    struct QNode *temp = newQNode(k);

    // if (isQEmpty(&q)) {
    if (q->rear == NULL) {
        // if the queue is empty, its rear and front are all empty
        q->front = q->rear = temp;
        return;
    }

    q->rear->next = temp;  // add it to the rear
    q->rear = temp;
}
struct QNode *deQueue(struct Queue *q) {
    // if (isQEmpty(&q)) {
    if (q->front == NULL)
        return NULL;  // if the queue is empty, its rear and front are all empty

    struct QNode *temp = q->front;
    q->front = q->front->next;

    if (q->front == NULL) q->rear = NULL;
    return temp;
}

/* BinTree's Traversal */

void levTraversal(BinTree *root) {
    // BinTree *curNode = root;
    struct Queue *q = createQueue();
    if (root != NULL) {
        enQueue(q, root);
        // printf("root set!%d\n", q->rear->key->val);
        // deleteQueue(&queue);
    }
    while (!isQEmpty(q)) {
        // insertQueue(&queue, curNode->left);
        if (q->front->key->left != NULL && q->front->key->left->hasVal)
            enQueue(q, q->front->key->left);
        if (q->front->key->right != NULL && q->front->key->right->hasVal)
            enQueue(q, q->front->key->right);
        printf("%d\n", deQueue(q)->key->val);
    }
    while (!isQEmpty(q)) {
        // insertQueue(&queue, curNode->left);
        printf("%d\n", deQueue(q)->key->val);
    }
}
void preOrder(BinTree *root) {
    struct Stack stack;
    BinTree *curNode;
    stack.top = 0;
    push(&stack, root);
    while (!isEmpty(&stack)) {
        curNode = pop(&stack);
        printf("%d\n", curNode->val);
        if (!isNEmpty(curNode->right)) {
            push(&stack, curNode->right);
        }
        if (!isNEmpty(curNode->left)) {
            push(&stack, curNode->left);
        }
    }
}
void preOrder2(BinTree *root) {
    struct Stack stack;
    BinTree *curNode = root;
    stack.top = 0;
    while (curNode != NULL || !isEmpty(&stack)) {
        while (!isNEmpty(curNode)) {
            printf("%d\n", curNode->val);
            push(&stack, curNode);
            curNode = curNode->left;
        }
        curNode = pop(&stack);
        curNode = curNode->right;
    }
}
void inOrder(BinTree *root) {
    struct Stack stack;
    BinTree *curNode = root;
    stack.top = 0;
    while (curNode != NULL || !isEmpty(&stack)) {
        while (!isNEmpty(curNode)) {
            push(&stack, curNode);
            curNode = curNode->left;
        }
        curNode = pop(&stack);
        printf("%d\n", curNode->val);
        curNode = curNode->right;
    }
}
void postOrder(BinTree *root) {
    struct Stack stack;
    BinTree *curNode;
    BinTree *prvNode = NULL;
    push(&stack, root);
    while (curNode != NULL || !isEmpty(&stack)) {
        curNode = top(&stack);
        if ((isNEmpty(curNode->left) && isNEmpty(curNode->right)) ||
            (!isNEmpty(prvNode) &&
             (prvNode == curNode->left || prvNode == curNode->right))) {
            printf("%d\n", curNode->val);
            pop(&stack);
            // printf("%d\n", top(&stack)->val);
            prvNode = curNode;
        } else {
            if (!isNEmpty(curNode->right)) push(&stack, curNode->right);
            if (!isNEmpty(curNode->left)) push(&stack, curNode->left);
        }
    }
}

int main() {
    failed = false;
    root = newNode();

    for (;;) {
        if (scanf("%s", s) != 1) {
            return false;
        }
        if (!strcmp(s, "()")) {
            break;
        }
        int val;
        sscanf(&s[1], "%d", &val);
        createNode(val, strchr(s, ',') + 1);
    }
    printf("levTraversal:\n");
    levTraversal(root);
    printf("preOrder:\n");
    preOrder(root);
    printf("preOrder2:\n");
    preOrder2(root);
    printf("inOrder:\n");
    inOrder(root);
    printf("postOrder:\n");
    postOrder(root);
    return 0;
}