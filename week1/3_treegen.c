#include <stdbool.h>
#include <stddef.h>
#include <stdio.h>
#include <string.h>

bool failed;
char s[128];
BinTree *root;
BinTree temp[];
int nodeN = 0;

typedef struct Node {
    bool hasVal;
    int val;
    struct Node *left, *right;
} BinTree;

BinTree *newNode() {
    temp[nodeN].hasVal = false;
    temp[nodeN].left = NULL;
    temp[nodeN].right = NULL;
    temp[nodeN].val = NULL;
    return &temp[nodeN++];
}

void createNode(int val, char *inp) {
    int len = strlen(inp);
    BinTree *curNode = root;
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

void levTraversal() {

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

    return 0;
}